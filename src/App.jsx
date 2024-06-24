import {useEffect} from 'react';
import {Route, Routes, useNavigate, Navigate, useParams, useLocation} from 'react-router-dom';
import {Menu, Alert} from 'antd';
import {NotificationOutlined, FileTextOutlined, CarryOutOutlined, FundOutlined, AimOutlined} from '@ant-design/icons';

import {License} from './page/License';
import {Board} from './page/Board';
import {UserSubmissions} from './page/UserSubmissions';
import {Writeup} from './page/Writeup';
import {Game} from './page/Game';
import {Announcements} from './page/Announcements';
import {Triggers} from './page/Triggers';
import {UserProfile} from './page/UserProfile';
import {Terms} from './page/Terms';
import {LoginOther} from './page/LoginOther';
import {Header} from './widget/Header';
import {Footer} from './widget/Footer';
import {Transition} from './widget/Transition';
import {TemplateFile} from './widget/Template';
import {useGameInfo} from './logic/GameInfo';
import {NotFound} from './utils'
import {SYBIL_ROOT} from './branding';
import {TABID} from './wish';

import './App.less';

function InfoRouter() {
    let {page} = useParams();
    let nav = useNavigate();
    let info = useGameInfo();

    return (
        <div className="slim-container">
            <Menu
                className="router-menu" mode="horizontal"
                selectedKeys={[page]} onSelect={(e)=>{nav(`/info/${e.key}`);}}
                items={[
                    {
                        key: 'announcements',
                        icon: <NotificationOutlined />,
                        label: '比赛公告',
                    },
                    {
                        key: 'triggers',
                        icon: <CarryOutOutlined />,
                        label: '赛程安排',
                    },
                    ...info.feature.templates.map(([name, title])=>({
                        key: name,
                        icon: <FileTextOutlined />,
                        label: title,
                    })),
                ]}
            />
            <br />
            {
                page==='announcements' ?
                    <Announcements /> :
                page==='triggers' ?
                    <Triggers /> :
                <TemplateFile name={page} />
            }
        </div>
    );
}

function BoardRouter() {
    let {name} = useParams();
    let nav = useNavigate();

    return (
        <div>
            <Menu
                className="router-menu" mode="horizontal"
                selectedKeys={[name]} onSelect={(e)=>{nav(`/board/${e.key}`);}}
                items={[
                    {
                        key: 'score_pku',
                        icon: <FundOutlined />,
                        label: '北京大学排名',
                    },
                    {
                        key: 'first_pku',
                        icon: <AimOutlined />,
                        label: '北京大学一血榜',
                    },
                    {
                        key: 'score_all',
                        icon: <FundOutlined />,
                        label: '总排名',
                    },
                    {
                        key: 'first_all',
                        icon: <AimOutlined />,
                        label: '总一血榜',
                    },
                ]}
            />
            <Board key={name} name={name} />
        </div>
    );
}

function AnticheatReporter() {
    let info = useGameInfo();

    useEffect(()=>{
        if(!(info.user && info.user.terms_agreed))
            return;

        function on_focus() {
            fetch(`${SYBIL_ROOT}event?name=focus&tabid=${TABID}`, {
                method: 'POST',
                credentials: 'include',
            });
        }
        function on_blur() {
            fetch(`${SYBIL_ROOT}event?name=blur&tabid=${TABID}`, {
                method: 'POST',
                credentials: 'include',
            });
        }
        function on_paste(e) {
            let upload = {};
            e.clipboardData.types.forEach((t)=>{
                let data = e.clipboardData.getData(t);
                upload[t] = data.slice(0, 2048);
            });
            fetch(`${SYBIL_ROOT}event?name=paste&tabid=${TABID}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(upload),
            });
        }

        window.addEventListener('focus', on_focus);
        window.addEventListener('blur', on_blur);
        document.addEventListener('paste', on_paste);
        return ()=>{
            window.removeEventListener('focus', on_focus);
            window.removeEventListener('blur', on_blur);
            document.removeEventListener('paste', on_paste);
        };
    }, [info.user]);

    return null;
}

function AppMain() {
    let location = useLocation();

    return (
        <Transition cur={location.pathname}>
            <Routes location={location}>
                <Route exact path="/" element={<Navigate to="/game" replace />} />
                <Route exact path="/game" element={<Game />} />

                <Route exact path="/board" element={<Navigate to="/board/score_pku" replace />} />
                <Route exact path="/board/:name" element={<BoardRouter />} />

                <Route exact path="/info" element={<Navigate to="/info/announcements" replace />} />
                <Route exact path="/info/:page" element={<InfoRouter />} />

                <Route exact path="/user/profile" element={<UserProfile />} />
                <Route exact path="/user/submissions" element={<UserSubmissions />} />
                <Route exact path="/user/terms" element={<Terms />} />

                <Route exact path="/login/other" element={<LoginOther />} />

                <Route exact path="/writeup" element={<Writeup />} />
                <Route exact path="/license" element={<License />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Transition>
    );
}

export function App() {
    return (
        <div>
            <AnticheatReporter />
            <Header />

            <div className="main-container">
                <Alert.ErrorBoundary>
                    <AppMain />
                </Alert.ErrorBoundary>
            </div>
            <Footer />
        </div>
    );
}