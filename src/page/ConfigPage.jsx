import {Card, Form, Radio, Button, App} from 'antd';
import {useFrontendConfig} from '../logic/FrontendConfig';
import {useGameInfo} from '../logic/GameInfo';
import {to_auth} from '../utils';
import {useEffect} from 'react';

import togeari from '../../assets/togeari.webp';
import './ConfigPage.less';

function TogeariVisualizer({toge, onClick}) {
    return (
        <div
            className="togeari-container"
            onClick={onClick}
        >
            <img
                src={togeari} alt={(toge==='ari' ? '有' : '无') + '刺'}
                className="togeari-img" style={{top: (toge==='ari' ? '-100%' : '0'), opacity: (toge==='ari' ? 1 : 0)}}
            />
        </div>
    )
}

function ConfigForm() {
    let info = useGameInfo();
    let {config, set_config, clear_config} = useFrontendConfig();
    let {message} = App.useApp();

    let form_style = {
        colon: false,
        labelCol: {span: 6},
        labelWrap: true,
        wrapperCol: {span: 13},
    };
    let card_style = {
        size: 'small',
        type: 'inner',
        bordered: false,
    };

    function config_setter(k) {
        return (e)=>{
            set_config({[k]: e.target.value});
        };
    }

    useEffect(() => {
        if(config.notif_toast!=='off') {
            if(!window.Notification) {
                set_config({notif_toast: 'off'});
                message.error({content: '浏览器不支持桌面通知', key: 'ConfigPage', duration: 2});
                return;
            }
            if(window.Notification.permission!=='granted') {
                window.Notification.requestPermission().then((permission)=>{
                    if(permission!=='granted') {
                        set_config({notif_toast: 'off'});
                        message.error({content: '未获得通知权限', key: 'ConfigPage', duration: 2});
                    }
                });
            }
        }
    }, [config.notif_toast]);

    return (<>
        <Card title="显示设置" {...card_style}>
            <Form {...form_style}>
                <Form.Item label="颜色">
                    <Radio.Group buttonStyle="solid" value={config.ui_selected_theme} onChange={config_setter('ui_selected_theme')}>
                        <Radio.Button value="auto">跟随系统</Radio.Button>
                        <Radio.Button value="light">浅色模式</Radio.Button>
                        <Radio.Button value="dark">深色模式</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="动画效果">
                    <Radio.Group buttonStyle="solid" value={config.ui_animation} onChange={config_setter('ui_animation')}>
                        <Radio.Button value="on">全部启用</Radio.Button>
                        <Radio.Button value="no_transition">禁用换页动画</Radio.Button>
                        <Radio.Button value="off">全部禁用</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Card>
        <br />
        <Card title="消息通知" {...card_style}>
            <Form {...form_style}>
                <Form.Item label="桌面通知">
                    <Radio.Group buttonStyle="solid" value={config.notif_toast} onChange={config_setter('notif_toast')}>
                        <Radio.Button value="off">禁用</Radio.Button>
                        <Radio.Button value="only_background">仅网页在后台时启用</Radio.Button>
                        <Radio.Button value="always">始终启用</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="语音播报">
                    <Radio.Group buttonStyle="solid" value={config.notif_tts} onChange={config_setter('notif_tts')}>
                        <Radio.Button value="off">禁用</Radio.Button>
                        <Radio.Button value="title">仅播报标题</Radio.Button>
                        <Radio.Button value="title_and_content">播报标题和内容</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="测试">
                    <Button block onClick={()=>{
                        if(window.gs_push_test) {
                            message.info({content: '大的要来了……', key: 'ConfigPage', duration: 2});
                            setTimeout(()=>{
                                if(window.gs_push_test)
                                    window.gs_push_test(
                                        (config.toge==='ari' && config.notif_tts==='title_and_content') ?
                                            '亲爱的顾客魏防止过耗请扫描排耗单上的二维码或关注每位不用等微信公众账号随时查看您的排队进程欧' :
                                            '如你所见，这是一条测试消息。',
                                    );
                            }, 2000);
                        } else {
                            message.error({content: '比赛未启用消息通知', key: 'ConfigPage', duration: 2});
                        }
                    }}>在两秒后发送测试消息</Button>
                </Form.Item>
            </Form>
        </Card>
        <br />
        <Card title="其他" {...card_style}>
            <Form {...form_style}>
                <Form.Item label="彩蛋">
                    <Radio.Group buttonStyle="solid" value={config.toge} onChange={config_setter('toge')}>
                        <Radio.Button value="ari">显示</Radio.Button>
                        <Radio.Button value="nashi">不显示</Radio.Button>
                    </Radio.Group>
                    <TogeariVisualizer toge={config.toge} onClick={()=>set_config({toge: config.toge==='ari' ? 'nashi' : 'ari'})} />
                </Form.Item>
                {info.user!==null && (
                    <Form.Item label="退出登录" extra={'当前用户：'+info.user.login_key}>
                        <Button danger block onClick={()=>to_auth('logout', message)}>退出登录当前用户</Button>
                    </Form.Item>
                )}
                <Form.Item label="重置" extra="此浏览器上的前端设置将恢复默认">
                    <Button danger block onClick={()=>{clear_config(); message.success({content: '已重置', key: 'ConfigPage', duration: 2}) }}>重置所有设置</Button>
                </Form.Item>
            </Form>
        </Card>
        <br />
    </>);
}

export function ConfigPage() {
    return (
        <div className="slim-container form-page-container">
            <h1>设置</h1>
            <ConfigForm />
        </div>
    )
}