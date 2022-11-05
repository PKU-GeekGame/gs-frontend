import {useEffect} from 'react';
import {Result, Button, Alert} from 'antd';
import {LoadingOutlined, WifiOutlined, RobotOutlined} from '@ant-design/icons';

import {useWishData} from '../wish';

export function GameLoading({set_info}) {
    let [error, data, load_data] = useWishData('game_info');

    useEffect(()=>{
        set_info(data);
    }, [set_info, data]);

    function force_reload() {
        if('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations()
                .then((registrations)=>{
                    for(let registration of registrations) {
                        console.log('unregister', registration);
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

    let retry_btn=(
        <Button key="refresh" type="primary" onClick={load_data}>重试</Button>
    );

    return (
        <div className="result-page-container">
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
                        title="API 版本更新"
                        subTitle={error.error_msg}
                        extra={[
                            <Button key="refresh" type="primary" onClick={force_reload}>刷新页面（可能需要清除浏览器缓存）</Button>,
                        ]}
                    /> :
                    <Result
                        status="error"
                        title="错误"
                        subTitle={error.error_msg}
                        extra={[retry_btn]}
                    />
                ) :
                <Result
                    icon={<LoadingOutlined />}
                    subTitle="获取比赛信息"
                />
            }
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