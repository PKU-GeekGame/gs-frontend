import React from 'react';
import ReactDOM from 'react-dom/client';
//import ReactDOMServer from 'react-dom/server';
import {ConfigProvider, Alert, App as AntdApp} from 'antd';
import {createHashRouter, RouterProvider} from 'react-router-dom';
import { StyleProvider } from '@ant-design/cssinjs';

import {GameInfoProvider} from './logic/GameInfo';
import {routes} from './App';

import zhCN from 'antd/es/locale/zh_CN';

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
                    colorPrimary: '#096dd9',
                    colorLink: '#096dd9',
                    colorText: '#000',
                    fontWeightStrong: 500,
                },
                components: {
                    App: {
                        fontSize: 16,
                    },
                }
            }}
        >
            <StyleProvider hashPriority="high">
                <Alert.ErrorBoundary>
                    <GameInfoProvider>
                        <AntdApp>
                            <RouterProvider router={router} />
                        </AntdApp>
                    </GameInfoProvider>
                </Alert.ErrorBoundary>
            </StyleProvider>
        </ConfigProvider>
    </React.StrictMode>
);

//console.log(ReactDOMServer.renderToString(component));
ReactDOM.createRoot(document.getElementById('root')).render(component);
