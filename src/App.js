import {Route, Routes, useNavigate, Navigate, useLocation} from 'react-router-dom';
import {Result, Button} from 'antd';
import {InboxOutlined} from '@ant-design/icons';

import {Header} from './widget/Header';
import {Footer} from './widget/Footer';
import {Game} from './page/Game';
import {UserProfile} from './page/UserProfile';
import {Terms} from './page/Terms';
import {cap} from './utils'

import './App.less';

function NotFound() {
    let loc = useLocation();
    let nav = useNavigate();

    return (
        <Result
            icon={<InboxOutlined />}
            status="error"
            title="页面不存在"
            subTitle={cap(loc.pathname, 25)}
            extra={[
                <Button key="home" onClick={()=>nav('/')}>返回主页</Button>
            ]}
        />
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
                    <Route exact path="/user/profile" element={<UserProfile />} />
                    <Route exact path="/user/terms" element={<Terms />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}