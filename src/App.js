import {useState} from 'react';
import {Route, Routes, useNavigate, Navigate, useLocation} from 'react-router-dom';
import {Result, Button, Menu} from 'antd';
import {InboxOutlined, NotificationOutlined, QuestionCircleOutlined, CarryOutOutlined} from '@ant-design/icons';

import {Header} from './widget/Header';
import {Footer} from './widget/Footer';
import {TemplateFile} from './widget/Template';
import {Game} from './page/Game';
import {Announcements} from './page/Announcements';
import {Triggers} from './page/Triggers';
import {UserProfile} from './page/UserProfile';
import {Terms} from './page/Terms';
import {NotFound} from './utils'

import './App.less';
import {License} from './page/License';

function InfoRouter() {
    let [route, set_route] = useState('announcements');

    return (
        <div className="slim-container">
            <Menu selectedKeys={[route]} onSelect={(e)=>{set_route(e.key)}} mode="horizontal">
                <Menu.Item key="announcements"><NotificationOutlined /> 比赛公告</Menu.Item>
                <Menu.Item key="faq"><QuestionCircleOutlined /> 选手常见问题</Menu.Item>
                <Menu.Item key="triggers"><CarryOutOutlined /> 赛程安排</Menu.Item>
            </Menu>
            <br />
            {route==='announcements' &&
                <Announcements />
            }
            {route==='faq' &&
                <TemplateFile name="faq" />
            }
            {route==='triggers' &&
                <Triggers />
            }
        </div>
    )
}

export function App() {
    return (
        <div>
            <Header />
            <div className="main-container">
                <Routes>
                    <Route exact path="/" element={<Navigate to="/game" replace />} />
                    <Route exact path="/game" element={<Game />} />
                    <Route exact path="/game/:challenge" element={<Game />} />
                    <Route exact path="/info" element={<InfoRouter />} />
                    <Route exact path="/user/profile" element={<UserProfile />} />
                    <Route exact path="/user/terms" element={<Terms />} />
                    <Route exact path="/license" element={<License />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}