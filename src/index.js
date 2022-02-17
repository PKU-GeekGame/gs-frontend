import React from 'react';
import ReactDOM from 'react-dom';
//import ReactDOMServer from 'react-dom/server';
import {ConfigProvider, Alert} from 'antd';
import {HashRouter} from 'react-router-dom';

import {GameInfoProvider} from './logic/GameInfo';
import {App} from './App';

import zhCN from 'antd/es/locale/zh_CN';

import './index.less';

let component = (
    <ConfigProvider autoInsertSpaceInButton={false} locale={zhCN}>
        <HashRouter>
            <Alert.ErrorBoundary>
                <GameInfoProvider>
                    <App />
                </GameInfoProvider>
            </Alert.ErrorBoundary>
        </HashRouter>
    </ConfigProvider>
);

//console.log(ReactDOMServer.renderToString(component));
ReactDOM.render(component, document.getElementById('root'));
