import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {ConfigProvider, Alert, App as AntdApp, theme as antd_theme} from 'antd';
import {createHashRouter, RouterProvider} from 'react-router';
import {StyleProvider, legacyLogicalPropertiesTransformer} from '@ant-design/cssinjs';
import {CloseCircleOutlined} from '@ant-design/icons';
import zhCN from 'antd/es/locale/zh_CN';

import {GameInfoProvider} from './logic/GameInfo';
import {routes} from './App';
import {FrontendConfigProvider, useFrontendConfig} from './logic/FrontendConfig';

import './polyfill';

import './index.less';

let router = createHashRouter(routes, {
    future: {
        v7_startTransition: true,
    },
});

function ThemeShell() {
    let {config, theme} = useFrontendConfig();
    let disable_all_anim = config.ui_animation==='off';

    useEffect(() => {
        document.documentElement.classList.add(`theme-${theme}`);
        return ()=>{
            document.documentElement.classList.remove(`theme-${theme}`);
        };
    }, [theme]);

    return (
        <ConfigProvider
            button={{
                autoInsertSpace: false,
            }}
            locale={zhCN}
            theme={{
                token: {
                    colorPrimary: theme==='dark' ? '#3396ff' : '#0063cc',
                    colorLink: theme==='dark' ? '#b8d9ff' : '#0063cc',
                    colorText: theme==='dark' ? '#fff' : '#000',
                    colorBorder: 'var(--card-border)',
                    fontWeightStrong: 500,
                    borderRadiusLG: 6,
                    motionDurationFast: disable_all_anim ? '.001s' : '0.1s',
                    motionDurationMid: disable_all_anim ? '.001s' : '0.2s',
                    motionDurationSlow: disable_all_anim ? '.001s' : '0.2s',
                },
                components: {
                    App: {
                        fontSize: 16,
                    },
                    Table: {
                        rowHoverBg: theme==='dark' ? '#333' : '#f9f9f9',
                        headerBg: theme==='dark' ? '#333' : '#f9f9f9',
                        headerBorderRadius: 0,
                    },
                },
                algorithm: theme==='dark' ? antd_theme.darkAlgorithm : antd_theme.defaultAlgorithm,
            }}
        >
            <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
                <Alert.ErrorBoundary>
                    <AntdApp
                        notification={{
                            duration: 7,
                            placement: 'topRight',
                            maxCount: 4,
                            top: 70,
                            closeIcon: (
                                <CloseCircleOutlined />
                            ),
                        }}
                        message={{
                            top: 1,
                        }}
                    >
                        <GameInfoProvider>
                            <RouterProvider router={router} />
                        </GameInfoProvider>
                    </AntdApp>
                </Alert.ErrorBoundary>
            </StyleProvider>
        </ConfigProvider>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <FrontendConfigProvider>
            <ThemeShell />
        </FrontendConfigProvider>
    </React.StrictMode>
);

queueMicrotask(console.log.bind(
    console,
    '%c比赛平台不是题目的一部分，解出题目无需攻击比赛平台。\n根据参赛须知，请仅对题目指定的主机（prob*.geekgame.pku.edu.cn）和程序进行攻击。',
    'font-size: 1.5em; background-color: yellow; color: black; font-weight: bold; padding: .5em',
));