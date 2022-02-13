import {useNavigate, useLocation} from 'react-router-dom';
import {Menu} from 'antd';
import {
    UnorderedListOutlined, CrownOutlined, NotificationOutlined, UserOutlined, LoginOutlined, CaretDownOutlined,
    EditOutlined, FileProtectOutlined, DisconnectOutlined, HomeOutlined, GlobalOutlined, HistoryOutlined
} from '@ant-design/icons';

import {useGameInfo} from '../ctx/GameInfo';
import {GAME_TITLE, GAME_LOGO} from '../branding';
import {cap, to_auth} from '../utils';


import "./Header.less";

export function Header() {
    let game_info = useGameInfo();
    let loc = useLocation();
    let nav = useNavigate();

    let cur_key = (
        loc.pathname.startsWith('/user/') ?
            loc.pathname :
            '/' + loc.pathname.substring(1).split('/')[0]
    );



    return (
        <div className="header-container">
            <div className="header">
                <div className="header-logo">
                    <span className="clickable" onClick={()=>nav('/')}>{GAME_LOGO}{GAME_TITLE}</span>
                </div>
                <div className="header-nav">
                    <Menu
                        mode="horizontal" theme="dark"
                        selectedKeys={[cur_key]} onSelect={(e)=>{if(e.key.charAt(0)!=='_') nav(e.key)}}
                    >
                        {!!game_info.feature.game &&
                            <Menu.Item key="/game"><UnorderedListOutlined /> 比赛主页</Menu.Item>
                        }
                        <Menu.Item key="/board"><CrownOutlined /> 排行榜</Menu.Item>
                        <Menu.Item key="/info"><NotificationOutlined /> 信息</Menu.Item>
                        {game_info.user ?
                            <Menu.SubMenu
                                key="_/user" popupOffset={[-6, 2]}
                                title={<>
                                    <span><UserOutlined /></span> {cap(game_info.user.profile.nickname||'账户', 15)}
                                    <span className="header-nav-caret"><CaretDownOutlined /></span>
                                </>}
                                popupClassName="header-nav-popup"
                            >
                                <Menu.Item key="/user/profile"><EditOutlined /> 个人资料</Menu.Item>
                                <Menu.Item key="/user/submissions"><HistoryOutlined /> 提交历史记录</Menu.Item>
                                <Menu.Item key="/user/terms"><FileProtectOutlined /> 参赛须知</Menu.Item>
                                <Menu.Item key="_/user/logout" danger onClick={()=>to_auth('logout')}><DisconnectOutlined /> 注销</Menu.Item>
                            </Menu.SubMenu> :
                            <Menu.SubMenu
                                key="_/login" popupOffset={[-6, 2]}
                                title={<>
                                    <LoginOutlined /> 登录
                                    <span className="header-nav-caret"><CaretDownOutlined /></span>
                                </>}
                                className="header-nav-login" popupClassName="header-nav-popup"
                            >
                                <Menu.Item key="_/login/pku" onClick={()=>to_auth('pku')}><HomeOutlined /> 北京大学登录</Menu.Item>
                                <Menu.Item key="/login/other"><GlobalOutlined /> 校外选手</Menu.Item>
                            </Menu.SubMenu>
                        }
                    </Menu>
                </div>
            </div>
        </div>
    );
}