import {useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {Menu, App} from 'antd';
import {
    UnorderedListOutlined,
    CrownOutlined,
    NotificationOutlined,
    UserOutlined,
    LoginOutlined,
    EditOutlined,
    FileProtectOutlined,
    HomeOutlined,
    GlobalOutlined,
    HistoryOutlined, SettingOutlined,
} from '@ant-design/icons';

import {useGameInfo} from '../logic/GameInfo';
import {GAME_TITLE} from '../branding';
import {Cap, to_auth, WithCaret} from '../utils';
import {preload as preload_table} from './TableLoader';
import {preload as preload_plot} from './TopStarPlotLoader';

import "./Header.less";

let preload_finished = false;

export function Header() {
    let info = useGameInfo();
    let loc = useLocation();
    let nav = useNavigate();
    let {message} = App.useApp();

    let cur_key = (
        loc.pathname.startsWith('/user/') ?
            loc.pathname :
            '/' + loc.pathname.substring(1).split('/')[0]
    );

    useEffect(() => {
        if(!preload_finished && cur_key==='/board') {
            preload_finished = true;
            preload_table();
            preload_plot();
        }
    }, [cur_key]);

    return (
        <div className="header-container">
            <div className="header">
                <div className="header-logo">
                    <span className="clickable" onClick={()=>nav('/game')}>
                        {GAME_TITLE}
                    </span>
                </div>
                <div className="header-nav">
                    <Menu
                        mode="horizontal" theme="dark"
                        selectedKeys={[cur_key]} onSelect={(e)=>{if(e.key.charAt(0)!=='_') nav(e.key + (e.item.props.default_subview || ''))}}
                        items={[
                            ...((info.feature.game && info.user) ? [{
                            key: '/game',
                            icon: <UnorderedListOutlined />,
                            label: '比赛主页',
                            }] : []),

                            {
                                key: '/board',
                                default_subview: '/score_all',
                                icon: <CrownOutlined />,
                                label: '排行榜',
                            },
                            {
                                key: '/info',
                                default_subview: '/announcements',
                                icon: <NotificationOutlined />,
                                label: '信息',
                            },

                            ...(info.user ? [{
                                key: '_/user',
                                icon: <UserOutlined />,
                                label: <WithCaret><Cap text={info.user.profile.nickname||'账户'} width={110} /></WithCaret>,

                                popupClassName: 'header-nav-popup',
                                popupOffset: [-6, 2],

                                children: [
                                    {
                                        key: '/user/profile',
                                        icon: <EditOutlined />,
                                        label: '队伍资料',
                                    },
                                    {
                                        key: '/user/submissions',
                                        icon: <HistoryOutlined />,
                                        label: '提交历史记录',
                                    },
                                    {
                                        key: '/user/terms',
                                        icon: <FileProtectOutlined />,
                                        label: '参赛须知',
                                    },
                                    {
                                        key: '/user/config',
                                        icon: <SettingOutlined />,
                                        label: '设置',
                                    },
                                ],
                            }] : [{
                                key: '/login/form',
                                icon: <LoginOutlined />,
                                label: '参赛',
                                className: 'header-nav-login',
                            }]),
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}