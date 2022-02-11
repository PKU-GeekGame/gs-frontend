import {Route, Routes, useNavigate, Navigate, useParams} from 'react-router-dom';
import {Menu, Alert} from 'antd';
import {NotificationOutlined, QuestionCircleOutlined, CarryOutOutlined, FundOutlined, AimOutlined} from '@ant-design/icons';

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
import {Board} from './page/Board';

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

function BoardRouter() {
    let {name} = useParams();
    let nav = useNavigate();

    return (
        <div>
            <Menu selectedKeys={[name]} onSelect={(e)=>{nav(`/board/${e.key}`);}} mode="horizontal">
                <Menu.Item key="score_pku"><FundOutlined /> 北京大学排名</Menu.Item>
                <Menu.Item key="first_pku"><AimOutlined /> 北京大学一血榜</Menu.Item>
                <Menu.Item key="score_all"><FundOutlined /> 总排名</Menu.Item>
                <Menu.Item key="first_all"><AimOutlined /> 总一血榜</Menu.Item>
            </Menu>
            <br />
            <Board name={name} />
        </div>
    )
}

export function App() {
    return (
        <div>
            <Header />
            <div className="main-container">
                <Alert.ErrorBoundary>
                    <Routes>
                        <Route exact path="/" element={<Navigate to="/game" replace />} />
                        <Route exact path="/game" element={<Game />} />
                        <Route exact path="/game/:challenge" element={<Game />} />

                        <Route exact path="/board" element={<Navigate to="/board/score_pku" replace />} />
                        <Route exact path="/board/:name" element={<BoardRouter />} />

                        <Route exact path="/info" element={<Navigate to="/info/announcements" replace />} />
                        <Route exact path="/info/:page" element={<InfoRouter />} />

                        <Route exact path="/user/profile" element={<UserProfile />} />
                        <Route exact path="/user/terms" element={<Terms />} />

                        <Route exact path="/license" element={<License />} />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Alert.ErrorBoundary>
            </div>
            <Footer />
        </div>
    );
}