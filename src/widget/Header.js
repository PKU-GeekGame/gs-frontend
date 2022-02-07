import {useContext} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {Menu} from 'antd';
import {
    UnorderedListOutlined, CrownOutlined, NotificationOutlined, UserOutlined, LoginOutlined, CaretDownOutlined,
    EditOutlined, FileProtectOutlined, DisconnectOutlined
} from '@ant-design/icons';

import {GameInfoCtx} from '../ctx/GameInfo';
import {GAME_TITLE, GAME_LOGO, AUTH_ROOT} from '../branding';

import "./Header.less";

function to_auth(endpoint) {
    window.location.href = AUTH_ROOT+endpoint;
}

export function Header() {
    let game_info = useContext(GameInfoCtx);
    let loc = useLocation();
    let nav = useNavigate();

    let cur_key = (
        loc.pathname.startsWith('/user/') ?
            loc.pathname :
            '/' + loc.pathname.substring(1).split('/')[0]
    );

    function cap(s, n) {
        if(s.length>n)
            return s.substring(0, n)+'…';
        else
            return s;
    }

    return (
        <div className="header-container">
            <div className="header">
                <div className="header-logo">
                    <span className="clickable" onClick={()=>nav('/')}>{GAME_LOGO}{GAME_TITLE}</span>
                </div>
                <div className="header-nav">
                    <Menu mode="horizontal" theme="dark" selectedKeys={cur_key} onSelect={(e)=>nav(e.key)}>
                        {!!game_info.feature.game &&
                            <Menu.Item key="/game"><UnorderedListOutlined /> 比赛主页</Menu.Item>
                        }
                        <Menu.Item key="/board"><CrownOutlined /> 排行榜</Menu.Item>
                        <Menu.Item key="/info"><NotificationOutlined /> 信息</Menu.Item>
                        {game_info.user ?
                            <Menu.SubMenu
                                key="/user" popupOffset={[-6, 2]}
                                title={<>
                                    <UserOutlined /> {cap(game_info.user.profile.nickname||'账户', 10)}
                                    <span className="header-nav-caret"><CaretDownOutlined /></span>
                                </>}
                                popupClassName="header-nav-popup"
                            >
                                <Menu.Item key="/user/profile"><EditOutlined /> 个人资料</Menu.Item>
                                <Menu.Item key="/user/terms"><FileProtectOutlined /> 参赛须知</Menu.Item>
                                <Menu.Item key="/user/logout" danger onClick={()=>to_auth('logout')}><DisconnectOutlined /> 注销</Menu.Item>
                            </Menu.SubMenu> :
                            <Menu.Item key="/login"><LoginOutlined /> 登录</Menu.Item>
                        }
                    </Menu>
                </div>
            </div>
        </div>
    );
}