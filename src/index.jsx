import React from 'react';
import ReactDOM from 'react-dom/client';
import {ConfigProvider, Alert, App as AntdApp} from 'antd';
import {createHashRouter, RouterProvider} from 'react-router-dom';
import {StyleProvider, legacyLogicalPropertiesTransformer} from '@ant-design/cssinjs';
import {CloseCircleOutlined} from '@ant-design/icons';
import zhCN from 'antd/es/locale/zh_CN';

import {GameInfoProvider} from './logic/GameInfo';
import {routes} from './App';

import './polyfill';

import './index.less';

let router = createHashRouter(routes, {
    future: {
        v7_startTransition: true,
    },
});

let component = (
    <React.StrictMode>
        <ConfigProvider
            button={{
                autoInsertSpace: false,
            }}
            locale={zhCN}
            theme={{
                token: {
                    colorPrimary: '#0063cc',
                    colorLink: '#0063cc',
                    colorText: '#000',
                    fontWeightStrong: 500,
                    borderRadiusLG: 6,
                    motionDurationSlow: '0.2s',
                },
                components: {
                    App: {
                        fontSize: 16,
                    },
                    Table: {
                        rowHoverBg: '#f9f9f9',
                        headerBg: '#f9f9f9',
                        headerBorderRadius: 0,
                    },
                }
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
    </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')).render(component);

queueMicrotask(console.log.bind(
    console,
    '%c比赛平台不是题目的一部分，解出题目无需攻击比赛平台。\n根据参赛须知，请仅对题目指定的主机（prob*.geekgame.pku.edu.cn）和程序进行攻击。',
    'font-size: 1.5em; background-color: yellow; color: black; font-weight: bold; padding: .5em',
));