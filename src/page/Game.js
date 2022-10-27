import {Fragment, useMemo, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Skeleton, message, Button, Empty, Tag, Alert, Input, Tooltip} from 'antd';
import {
    PieChartFilled, CheckSquareOutlined, SyncOutlined, HistoryOutlined, RightCircleOutlined, CaretDownOutlined,
    QuestionCircleOutlined, FlagOutlined, SolutionOutlined
} from '@ant-design/icons';

import {Reloader} from './GameLoading';
import {Announcement} from './Announcements';
import {useGameInfo} from '../logic/GameInfo';
import {TemplateFile, TemplateStr} from '../widget/Template';
import {ChallengeIcon, FlagIcon} from '../widget/ChallengeIcon';
import {TokenWidget} from '../widget/TokenWidget';
import {TouchedUsersLink} from '../widget/TouchedUsers';
import {useWishData, wish} from '../wish';
import {TimestampAgo, NotFound, useReloadButton} from '../utils';
import {WEB_TERMINAL_ADDR, ATTACHMENT_ADDR} from '../branding';

import './Game.less';

function ChallengeAction({action}) {
    /* eslint-disable react/jsx-no-target-blank */

    if(action.type==='webpage')
        return (<>
            你可以 <a href={action.url} target="_blank">访问{action.name}</a>
        </>);
    else if(action.type==='terminal')
        return (<>
            你可以 <a href={WEB_TERMINAL_ADDR(action)}>打开网页终端</a> 或者通过命令{' '}
            <code>nc {action.host} {action.port}</code> 连接到{action.name}
        </>);
    else if(action.type==='attachment')
        return (<>
            你可以 <a href={ATTACHMENT_ADDR(action)}>下载{action.name}</a>
        </>);
}

function FlagInput({do_reload_list, ch}) {
    let [loading, set_loading] = useState(false);

    function do_submit(flag) {
        if(!flag)
            return;

        message.loading({content: '正在提交…', key: 'FlagInput', duration: 10});
        set_loading(true);

        wish('submit_flag', {
            challenge_key: ch.key,
            flag: flag,
        })
            .then((res)=>{
                set_loading(false);
                if(res.error)
                    message.error({content: res.error_msg, key: 'FlagInput', duration: 3});
                else {
                    message.success({content: '提交成功', key: 'FlagInput', duration: 2});
                    do_reload_list();
                }
            });
    }

    return (
        <div>
            <Input.Search
                size="large"
                addonBefore={
                    ch.flags.length>1 ?
                        <Tooltip title={`此题有 ${ch.flags.length} 个 Flag，系统会识别你提交的是哪一个`}>
                            提交任意 Flag：<QuestionCircleOutlined />
                        </Tooltip> :
                        '提交 Flag：'
                }
                placeholder="flag{...}"
                enterButton={<><FlagOutlined /> 提交</>}
                onSearch={do_submit}
                loading={loading}
            />
        </div>
    );
}

function Challenge({ch, do_reload_list}) {
    return (
        <div className="challenge-body">
            <h1>{ch.title}</h1>
            <p className="challenge-stat">
                基础分值 {ch.tot_base_score}，
                目前分值 {ch.tot_cur_score}，
                <TouchedUsersLink ch={ch}>共 {ch.passed_users_count} 人通过</TouchedUsersLink>
            </p>
            <br />
            <TemplateStr name="challenge-desc">{ch.desc}</TemplateStr>
            <br />
            {ch.actions.map((action, idx)=>(
                <p key={idx} className="challenge-action">
                    <RightCircleOutlined />{' '}
                    <ChallengeAction action={action} />
                </p>
            ))}
            {ch.status==='passed' ?
                <Alert type="success" showIcon message="你已经通过此题" /> :
                <FlagInput do_reload_list={do_reload_list} ch={ch} />
            }
            <br />
            <TokenWidget />
        </div>
    );
}

function PortalUserInfo({info}) {
    let nav = useNavigate();

    return (
        <div className="portal-user-info" onClick={()=>nav('/board/'+info.active_board_key)}>
            <div className="portal-user-info-status">
                {info.status_line}
            </div>
            {info.tot_score_by_cat!==null &&
                <div className="portal-user-info-cat">
                    <PieChartFilled />{' '}
                    {info.tot_score_by_cat.map((cat, idx)=>(
                        <Fragment key={cat}>
                            {idx!==0 ? ' + ' : null}
                            {cat[0]} {cat[1]}
                        </Fragment>
                    ))}
                </div>
            }
        </div>
    );
}

function PortalChallengeList({list, active_key}) {
    let nav = useNavigate();

    return (
        <div className="portal-chall-list">
            {list===null ?
                <Alert showIcon type="info" message="现在不允许查看题目" /> :
                <>
                    <div className="portal-chall-row portal-chall-header">
                        <div className="portal-chall-col-title">
                            题目名称
                        </div>
                        <div className="portal-chall-col-score">
                            分值 / <small>通过人数</small>
                        </div>
                    </div>
                    {list.map((ch)=>(
                        <Fragment key={ch.key}>
                            <div
                                className={`portal-chall-row${active_key===ch.key ? ' portal-chall-row-active' : ''}`}
                                onClick={()=>nav('/game/'+ch.key)}
                            >
                                <div className="portal-chall-col-title">
                                    <span className="portal-chall-category-badge">
                                        <Tag color={ch.category_color}>{ch.category}</Tag>
                                    </span>
                                    <ChallengeIcon status={ch.status} /> {ch.title}
                                    {ch.flags.length>1 && <span className="portal-chall-caret"><CaretDownOutlined /></span>}
                                </div>
                                <div className="portal-chall-col-score">
                                    {ch.tot_cur_score} / <small><CheckSquareOutlined /> {ch.passed_users_count}</small>
                                </div>
                            </div>
                            {active_key===ch.key && ch.flags.length>1 &&
                                ch.flags.map((f, idx)=>(
                                    <div key={idx} className="portal-chall-row portal-chall-row-active portal-chall-row-flag">
                                        <div className="portal-chall-col-title">
                                            <FlagIcon status={f.status} /> {f.name}
                                        </div>
                                        <div className="portal-chall-col-score">
                                            {f.cur_score} / <small><CheckSquareOutlined /> {f.passed_users_count}</small>
                                        </div>
                                    </div>
                                ))
                            }
                        </Fragment>
                    ))}
                    {list.length===0 &&
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无题目" />
                    }
                </>
            }
        </div>
    );
}

function Portal() {
    let [error, data, load_data] = useWishData('game');
    let nav = useNavigate();
    let [last_reloaded, mark_reload, reload_btn] = useReloadButton(3);
    let params = useParams();

    let active_challenge_key = params.challenge===undefined ? null : params.challenge;

    let active_challenge = useMemo(()=>{
        if(data!==null && data.challenge_list!==null)
            for(let ch of data.challenge_list)
                if(ch.key===active_challenge_key)
                    return ch;
        return null;
    }, [data, active_challenge_key]);

    if(error) {
        if(error.error==='SHOULD_AGREE_TERMS') {
            message.info({content: error.error_msg, key: 'Portal.Error', duration: 2});
            nav('/user/terms');
        }
        if(error.error==='SHOULD_UPDATE_PROFILE') {
            message.info({content: error.error_msg, key: 'Portal.Error', duration: 2});
            nav('/user/profile');
        }

        return (
            <div className="slim-container">
                <Reloader message={error.error_msg} reload={()=>{
                    mark_reload();
                    load_data();
                }} />
            </div>
        );
    }

    return (
        <div className="portal-container">
            <div className="portal-sidebar">
                <div className="portal-reloader">
                    <div>
                        <HistoryOutlined /> {last_reloaded!==0 && <>
                            <TimestampAgo ts={last_reloaded} />更新
                        </>}
                    </div>
                    <div>
                        <Button type="link" ref={reload_btn} onClick={()=>{
                            message.success({content: '已刷新题目数据', key: 'Portal.ManualLoadData', duration: 2});
                            mark_reload();
                            load_data();
                        }}>
                            <SyncOutlined /> 刷新题目
                        </Button>
                    </div>
                </div>

                {data===null ?
                    <Skeleton /> :
                    <>
                        {!!data.show_writeup &&
                            <div className="portal-writeup-btn">
                                <Button block size="large" onClick={()=>nav('/writeup')} type="primary">
                                    <SolutionOutlined /> 提交 Writeup
                                </Button>
                            </div>
                        }
                        <PortalUserInfo info={data.user_info} />
                        <PortalChallengeList list={data.challenge_list} active_key={active_challenge_key} />
                    </>
                }
            </div>
            <div className="portal-main">
                {data!==null && data.last_announcement!==null &&
                    <Announcement
                        announcement={data.last_announcement}
                        extra={
                            <a href="#/info/announcements">
                                <RightCircleOutlined /> 查看所有公告
                            </a>
                        }
                    />
                }
                {active_challenge!==null ?
                    <Challenge ch={active_challenge} do_reload_list={load_data} />:
                (active_challenge_key!==null && data!==null) ?
                    <NotFound /> :
                    <TemplateFile name="game" />
                }
            </div>
        </div>
    );
}

export function Game() {
    let info = useGameInfo();

    if(!info.feature.game)
        return (
            <div className="slim-container">
                <TemplateFile name="game" />
            </div>
        );
    else
        return (
            <Portal />
        );
}