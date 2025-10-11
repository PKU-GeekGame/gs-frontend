import {useEffect, useRef} from 'react';
import {App} from 'antd';
import {NotificationOutlined, CarryOutOutlined, RocketOutlined} from '@ant-design/icons';

import {useFrontendConfig} from './FrontendConfig';
import {TABID} from '../wish';
import {SVC_ROOT} from '../api_config';
import {tts_say} from '../utils';

import './PushDaemon.less';

const PUSH_STARTUP_DELAY_MS = 2000;
const PUSH_RECONNECT_DELAY_MS = 5000;
const PUSH_STABLE_MS = 25000;
const PUSH_RECONNECT_MAX = 8;

const WS_ROOT = SVC_ROOT+'ws/';
const PUSH_DEBUG = localStorage['gs_push_debug'] || false;

function rnd_delay() { // add a random delay to flatten the backend load
    return 200 + Math.random()*1300;
}

function arbitration(callback) {
    let nonce = `${+new Date()}-${Math.random()}`;
    localStorage.setItem('gs_push_arbitration', nonce);
    setTimeout(()=>{
        if(localStorage.getItem('gs_push_arbitration')===nonce)
            callback();
    }, 1000);
}

function fix_tts_user_gesture() {
    // xxx: mobile safari requires a user gesture to use speech synthesis
    // https://stackoverflow.com/questions/61658740/speechsynthesis-not-working-on-mobile-safari-even-though-its-supported#answer-79296650
    if(!window._fix_tts_user_gesture) {
        window._fix_tts_user_gesture = true;
        function listener() {
            tts_say('');
            document.removeEventListener('click', listener, {passive: true});
        }
        document.addEventListener('click', listener, {passive: true});
    }
}

class PushClient {
    constructor() {
        this.ws = null;
        this.stopped = false;
        this.count_reconnect = 0;

        this.app = null;
        this.reload_info = null;
        this.config = null;

        setTimeout(()=>{
            this.connect();
        }, PUSH_STARTUP_DELAY_MS);

        window.gs_push_test = (body, title) => this.handle_message({
            type: 'frontent_test',
            body: body,
            title: title || '测试消息',
        });
    }

    show_message(type, icon, title, description, target_url) {
        this.app.notification[type]({
            key: `notification-${+new Date()}`,
            className: 'push-notif',
            icon: icon,
            message: title,
            description: description,
            onClick: target_url ? ()=>{window.location.href = target_url} : null,
        });

        let send_toast = (
            this.config.notif_toast==='always'
            || (this.config.notif_toast==='only_background' && document.visibilityState==='hidden')
        );
        let tts_msg = (
            this.config.notif_tts==='title' ? `${title}。` :
            this.config.notif_tts==='title_and_content' ? `${title}。${description}。` :
                null
        );

        arbitration(()=>{
            if(send_toast && window.Notification) {
                let notif = new window.Notification(title, {body: description});
                if(target_url)
                    notif.addEventListener('click', ()=>{
                        // browser will focus the current tab unless preventDefault(), so no need to call window.focus()
                        window.location.href = target_url;
                    });
            }

            if(tts_msg) {
                tts_say(tts_msg);
            }
        });
    }

    handle_message(data) {
        if(PUSH_DEBUG)
            console.log('PushClient: handle message', data);

        if(data.type==='new_announcement') {
            this.show_message(
                'info',
                <NotificationOutlined />,
                '比赛公告',
                `有新的公告【${data.title}】`,
                '#/info/announcements',
            );
        } else if(data.type==='tick_update') {
            setTimeout(()=>{
                this.show_message(
                    'info',
                    <CarryOutOutlined />,
                    '赛程提醒',
                    data.new_tick_name.replace(/;/, '，'),
                    '#/info/triggers',
                );
                this.reload_info();
            }, rnd_delay());
        } else if(data.type==='flag_first_blood') {
            this.show_message(
                'success',
                <RocketOutlined />,
                'Flag 一血提醒',
                `恭喜【${data.nickname}】在【${data.board_name}】中拿到了题目【${data.challenge}】的【${data.flag}】一血`,
                null,
            );
        } else if(data.type==='challenge_first_blood') {
            this.show_message(
                'success',
                <RocketOutlined />,
                '题目一血提醒',
                `恭喜【${data.nickname}】在【${data.board_name}】中拿到了题目【${data.challenge}】的一血`,
                null,
            );
        } else if(data.type==='reload_user') {
            setTimeout(()=>{
                this.reload_info();
            }, rnd_delay());
        } else if(data.type==='frontent_test') {
            this.show_message(
                'info',
                <NotificationOutlined />,
                data.title,
                data.body,
                null,
            );
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
        window.gs_push_test = null;
        if(this.ws!==null)
            this.ws.close();
    }
}

export function PushDaemon({info, reload_info}) {
    let app = App.useApp();
    let {config} = useFrontendConfig();
    let client = useRef(null);

    useEffect(()=>{
        function sync_properties(c) {
            c.app = app;
            c.reload_info = reload_info;
            c.config = config;
        }

        if(client.current)
            sync_properties(client.current);

        // maybe spawn client
        if(client.current===null && info!==null && info.feature.push) {
            client.current = new PushClient();
            sync_properties(client.current);

            // stop websocket to make the page available for bfcache
            window.addEventListener('pagehide', (e)=>{
                if(PUSH_DEBUG)
                    console.log('PushClient: pagehide', e.persisted);

                client.current.stop();
            }, {capture: true});
            window.addEventListener('pageshow', (e)=>{
                if(PUSH_DEBUG)
                    console.log('PushClient: pageshow', e.persisted);

                client.current.stop();
                client.current = new PushClient(reload_info, app);
                sync_properties(client.current);
            }, {capture: true});
        }
    });

    useEffect(()=>{
        return ()=>{
            if(client.current) {
                client.current.stop();
                client.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if(config.notif_tts!=='off')
            fix_tts_user_gesture();
    }, [config]);

    return null;
}