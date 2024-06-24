import React from 'react';
import ReactDOM from 'react-dom/client';
//import ReactDOMServer from 'react-dom/server';
import {ConfigProvider, Alert, App as AntdApp} from 'antd';
import {HashRouter} from 'react-router-dom';
import { StyleProvider } from '@ant-design/cssinjs';

import {GameInfoProvider} from './logic/GameInfo';
import {App} from './App';

import zhCN from 'antd/es/locale/zh_CN';

import './index.less';

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
                <HashRouter future={{v7_startTransition: true}}>
                    <Alert.ErrorBoundary>
                        <GameInfoProvider>
                            <AntdApp>
                                <App />
                            </AntdApp>
                        </GameInfoProvider>
                    </Alert.ErrorBoundary>
                </HashRouter>
            </StyleProvider>
        </ConfigProvider>
    </React.StrictMode>
);

//console.log(ReactDOMServer.renderToString(component));
ReactDOM.createRoot(document.getElementById('root')).render(component);
