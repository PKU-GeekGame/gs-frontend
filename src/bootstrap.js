import React from 'react';
import ReactDOM from 'react-dom/client';
//import ReactDOMServer from 'react-dom/server';
import {ConfigProvider, Alert, App as AntdApp} from 'antd';
import {HashRouter} from 'react-router-dom';

import {GameInfoProvider} from './logic/GameInfo';
import {App} from './App';

import zhCN from 'antd/es/locale/zh_CN';

import './bootstrap.less';

let component = (
    <ConfigProvider
        autoInsertSpaceInButton={false}
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
                }
            }
        }}
    >
        <HashRouter>
            <Alert.ErrorBoundary>
                <GameInfoProvider>
                    <AntdApp>
                        <App />
                    </AntdApp>
                </GameInfoProvider>
            </Alert.ErrorBoundary>
        </HashRouter>
    </ConfigProvider>
);

//console.log(ReactDOMServer.renderToString(component));
ReactDOM.createRoot(document.getElementById('root')).render(component);
