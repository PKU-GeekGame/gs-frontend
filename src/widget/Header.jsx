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
    DisconnectOutlined,
    GlobalOutlined,
    HistoryOutlined, BankOutlined,
} from '@ant-design/icons';

import {useGameInfo} from '../logic/GameInfo';
import {GAME_TITLE, Logo} from '../branding';
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

    let grp = 'all';
    if(info.user) {
        if(info.user.group==='pku')
            grp = 'pku';
        else if(info.user.group==='thu')
            grp = 'thu';
    }

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
                        <Logo cur_url={cur_key} />
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
                                default_subview: '/score_'+grp,
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
                                        label: '个人资料',
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
                                        key: '_/user/logout',
                                        icon: <DisconnectOutlined />,
                                        label: '注销',
                                        danger: true,
                                        onClick: ()=>to_auth('logout', message),
                                    },
                                ],
                            }] : [{
                                key: '_/login',
                                icon: <LoginOutlined />,
                                label: <WithCaret>参赛</WithCaret>,

                                className: 'header-nav-login',
                                popupClassName: 'header-nav-popup',
                                popupOffset: [-6, 2],

                                children: [
                                    {
                                        key: '_/login/pku',
                                        icon: <BankOutlined />,
                                        label: '北京大学登录',
                                        onClick: ()=>to_auth('pku/redirect', message),
                                    },
                                    {
                                        key: '_/login/thu',
                                        icon: <BankOutlined />,
                                        label: '清华大学登录',
                                        onClick: ()=>to_auth('carsi/login', message),
                                    },
                                    {
                                        key: '/login/other',
                                        icon: <GlobalOutlined />,
                                        label: '校外选手',
                                    },
                                ],
                            }]),
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}