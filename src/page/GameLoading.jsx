import {useEffect} from 'react';
import {Result, Button, Alert} from 'antd';
import {WifiOutlined, RobotOutlined} from '@ant-design/icons';

import {useWishData} from '../wish';
import {GAME_TITLE} from '../branding';
import {Loading} from '../widget/Loading';

function HeaderSkeleton() {
    return (
        <div>
            <div className="header-container">
                <div className="header">
                    <div className="header-logo">
                        {GAME_TITLE}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function GameLoading({set_info}) {
    let [error, data, load_data] = useWishData('game_info');

    useEffect(()=>{
        let ts = +new Date();
        if(data)
            set_info({
                ...data,
                diag_ts: ts - data.diag_ts*1000,
            });
        else
            set_info(null);
    }, [set_info, data]);

    function force_reload() {
        if('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations()
                .then((registrations)=>{
                    for(let registration of registrations) {
                        // noinspection JSIgnoredPromiseFromCall
                        registration.unregister();
                    }
                });
        }
        setTimeout(()=>{
            // noinspection JSCheckFunctionSignatures
            window.location.reload(true);
        }, 150);
    }

    let retry_btn = (
        <Button key="refresh" type="primary" onClick={load_data}>重试</Button>
    );

    return (
        <div>
            <HeaderSkeleton />
            <div className="main-container">
                {error ? (
                    error.error==='HTTP_REQ_FAILED' ?
                        <Result
                            icon={<WifiOutlined />}
                            status="error"
                            title="网络错误"
                            subTitle={error.error_msg}
                            extra={[retry_btn]}
                        /> :
                    error.error==='WISH_VERSION_MISMATCH' ?
                        <Result
                            icon={<RobotOutlined />}
                            status="error"
                            title="比赛平台更新"
                            subTitle={error.error_msg}
                            extra={[
                                <Button key="refresh" type="primary" onClick={force_reload}>刷新页面</Button>,
                            ]}
                        /> :
                        <Result
                            status="error"
                            title="错误"
                            subTitle={error.error_msg}
                            extra={[retry_btn]}
                        />
                    ) :
                    <Loading height={500} />
                }
            </div>
        </div>
    );
}

export function Reloader({message, reload}) {
    return (
        <Alert
            type="error" showIcon
            message={message}
            action={
                <Button onClick={reload}>重试</Button>
            }
        />
    );
}