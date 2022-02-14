import React from 'react';
import ReactDOM from 'react-dom';
import {ConfigProvider, Alert} from 'antd';
import {HashRouter} from 'react-router-dom';

import {GameInfoProvider} from './logic/GameInfo';
import {App} from './App';

import zhCN from 'antd/es/locale/zh_CN';

import './index.less';

ReactDOM.render(
  <ConfigProvider autoInsertSpaceInButton={false} locale={zhCN}>
      <HashRouter>
          <Alert.ErrorBoundary>
              <GameInfoProvider>
                  <App />
              </GameInfoProvider>
          </Alert.ErrorBoundary>
      </HashRouter>
  </ConfigProvider>,
  document.getElementById('root')
);
