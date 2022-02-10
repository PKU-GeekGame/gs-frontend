import {Route, Routes, useNavigate, Navigate, useParams} from 'react-router-dom';
import {Menu} from 'antd';
import {NotificationOutlined, QuestionCircleOutlined, CarryOutOutlined} from '@ant-design/icons';

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
    let {page} = useParams();
    let nav = useNavigate();

    return (
        <div className="slim-container">
            <Menu selectedKeys={[page]} onSelect={(e)=>{nav(`/info/${e.key}`);}} mode="horizontal">
                <Menu.Item key="announcements"><NotificationOutlined /> 比赛公告</Menu.Item>
                <Menu.Item key="faq"><QuestionCircleOutlined /> 选手常见问题</Menu.Item>
                <Menu.Item key="triggers"><CarryOutOutlined /> 赛程安排</Menu.Item>
            </Menu>
            <br />
            {page==='announcements' ?
                <Announcements /> :
            page==='faq' ?
                <TemplateFile name="faq" /> :
            page==='triggers' ?
                <Triggers /> : <NotFound />
            }
        </div>
    );
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

                    <Route exact path="/info" element={<Navigate to="/info/announcements" replace />} />
                    <Route exact path="/info/:page" element={<InfoRouter />} />

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