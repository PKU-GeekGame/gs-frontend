import {useEffect} from 'react';
import {App} from 'antd';
import {NotificationOutlined, CarryOutOutlined, RocketOutlined} from '@ant-design/icons';

import {TABID} from '../wish';
import {WS_ROOT} from '../branding';

import './PushDaemon.less';

const PUSH_STARTUP_DELAY_MS = 2000;
const PUSH_RECONNECT_DELAY_MS = 5000;
const PUSH_STABLE_MS = 25000;
const PUSH_RECONNECT_MAX = 8;

function rnd_delay() { // add a random delay to flatten the backend load
    return 200 + Math.random()*1300;
}

const PUSH_DEBUG = localStorage['gs_push_debug'] || false;

class PushClient {
    constructor(reload_info, app) {
        this.app = app;
        this.ws = null;
        this.stopped = false;
        this.count_reconnect = 0;
        this.reload_info = reload_info;

        setTimeout(()=>{
            this.connect();
        }, PUSH_STARTUP_DELAY_MS);
    }

    handle_message(data) {
        let key = `notification-${+new Date()}`;
        let notif_conf = {
            key: key,
            className: 'push-notif',
        };

        if(PUSH_DEBUG)
            console.log('PushClient: handle message', data);

        if(data.type==='new_announcement') {
            this.app.notification.info({
                ...notif_conf,
                icon: <NotificationOutlined />,
                message: '比赛公告',
                description: `有新的公告【${data.title}】`,
            });
        } else if(data.type==='tick_update') {
            setTimeout(()=>{
                this.app.notification.info({
                    ...notif_conf,
                    icon: <CarryOutOutlined />,
                    message: '赛程提醒',
                    description: data.new_tick_name.replace(/;/, '，'),
                });
                this.reload_info();
            }, rnd_delay());
        } else if(data.type==='flag_first_blood') {
            this.app.notification.success({
                ...notif_conf,
                icon: <RocketOutlined />,
                message: 'Flag 一血提醒',
                description: `恭喜【${data.nickname}】在【${data.board_name}】中拿到了题目【${data.challenge}】的【${data.flag}】的一血`,
            });
        } else if(data.type==='challenge_first_blood') {
            this.app.notification.success({
                ...notif_conf,
                icon: <RocketOutlined />,
                message: '题目一血提醒',
                description: `恭喜【${data.nickname}】在【${data.board_name}】中拿到了题目【${data.challenge}】的一血`,
            });
        } else if(data.type==='reload_user') {
            setTimeout(()=>{
                this.reload_info();
            }, rnd_delay());
        }
    }

    connect() {
        if(this.stopped)
            return;

        let url = new URL(WS_ROOT+'push?tabid='+TABID, window.location.href);
        url.protocol = url.protocol==='http:' ? 'ws:' : 'wss:';

        this.ws = new WebSocket(url.href);
        if(PUSH_DEBUG)
            console.log('PushClient: connecting to', url.href);

        let stable_waiter = null;
        this.ws.onopen = ()=>{
            if(PUSH_DEBUG)
                console.log('PushClient: socket opened');
            stable_waiter = setTimeout(()=>{
                this.count_reconnect = 0;
            }, PUSH_STABLE_MS);
        }

        this.ws.onclose = (e)=>{
            if(e.code===4337) {
                if(PUSH_DEBUG)
                    console.log('PushClient: socket closed by server, will not retry', e.reason);

                this.stopped = true;
            }
            if(this.stopped)
                return;

            if(PUSH_DEBUG)
                console.log('PushClient: socket closed, will reconnect later', e);

            setTimeout(()=>{
                if(this.count_reconnect<PUSH_RECONNECT_MAX) {
                    this.count_reconnect++;
                    this.connect();
                } else {
                    if(PUSH_DEBUG)
                        console.log('PushClient: stopped reconnecting');

                    this.app.message.error({content: '消息推送连接中断', key: 'PushDaemon.Error', duration: 3});
                }
            }, PUSH_RECONNECT_DELAY_MS);

            if(stable_waiter!=null)
                clearTimeout(stable_waiter);
        };

        this.ws.onmessage = (e)=>{
            this.handle_message(JSON.parse(e.data));
        };
    }

    stop() {
        this.stopped = true;
        if(this.ws!==null)
            this.ws.close();
    }
}

export function PushDaemon({info, reload_info}) {
    let app = App.useApp();

    useEffect(()=>{
        if(info!==null && info.feature.push) {
            let client = new PushClient(reload_info, app);

            // stop websocket to make the page available for bfcache
            window.addEventListener('pagehide', (e)=>{
                if(PUSH_DEBUG)
                    console.log('PushClient: pagehide', e.persisted);

                client.stop();
            }, {capture: true});
            window.addEventListener('pageshow', (e)=>{
                if(PUSH_DEBUG)
                    console.log('PushClient: pageshow', e.persisted);

                client.stop();
                client = new PushClient(reload_info, app);
            }, {capture: true});

            return ()=>{
                client.stop();
            };
        }
    }, [info, reload_info]);

    return null;
}