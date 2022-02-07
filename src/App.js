import {useContext} from 'react';
import {Route, Routes, useNavigate, Navigate} from 'react-router-dom';
import {Result, Button} from 'antd';
import {InboxOutlined} from '@ant-design/icons';

import {GameInfoCtx} from './ctx/GameInfo';
import {Header} from './widget/Header';
import {Footer} from './widget/Footer';

import './App.less';

function NotFound() {
    let nav = useNavigate();

    return (
        <Result
            icon={<InboxOutlined />}
            status="error"
            title="页面不存在"
            extra={[
                <Button key="home" onClick={()=>nav('/')}>返回主页</Button>
            ]}
        />
    )
}

export function App() {
    let game_info = useContext(GameInfoCtx);

    return (
        <div>
            <Header />
            <Routes>
                <Route exact path="/" element={<Navigate to={game_info.user ? '/game' : '/login'} replace />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </div>
    );
}