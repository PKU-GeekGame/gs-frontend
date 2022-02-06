import React from 'react';
import ReactDOM from 'react-dom';
import {ConfigProvider} from 'antd';

import {App} from './App';

import zhCN from 'antd/es/locale/zh_CN';

import './index.less';

ReactDOM.render(
  <React.StrictMode>
      <ConfigProvider autoInsertSpaceInButton={false} locale={zhCN}>
        <App />
      </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
