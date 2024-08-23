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
                },
                components: {
                    App: {
                        fontSize: 16,
                    },
                    Table: {
                        rowHoverBg: '#f9f9f9',
                        headerBg: '#f9f9f9',
                        headerBorderRadius: '0',
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