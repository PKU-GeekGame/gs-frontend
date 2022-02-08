import {useState, useEffect, useCallback} from 'react';
import {Result, Button} from 'antd';
import {LoadingOutlined, WifiOutlined, RobotOutlined} from '@ant-design/icons';

import {wish} from '../wish';

export function GameLoading({set_info}) {
    let [error, set_error] = useState(null);

    let load_info = useCallback(()=>{
        set_error(null);
        wish('game_info')
            .then((res)=>{
                if(res.error)
                    set_error(res);
                else {
                    set_error(null);
                    set_info(res);
                }
            });
    }, [set_info]);

    useEffect(()=>{
        load_info();
    }, [load_info]);

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
        <Button key="refresh" type="primary" onClick={load_info}>重试</Button>
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
                        title="版本不匹配"
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
                    subTitle="加载比赛信息"
                />
            }
        </div>
    );
}