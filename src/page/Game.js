import {Fragment, useMemo, useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Skeleton, message, Button, Empty, Tag, Alert, Input, Tooltip, Popover, Card, Table} from 'antd';
import {
    PieChartFilled,
    SyncOutlined,
    HistoryOutlined,
    RightCircleOutlined,
    UpOutlined,
    CaretDownOutlined,
    QuestionCircleOutlined,
    FlagOutlined,
    SolutionOutlined,
    CodepenOutlined,
    HomeOutlined,
    GlobalOutlined,
    CarryOutOutlined,
    FileTextOutlined,
    FireOutlined
} from '@ant-design/icons';

import {Reloader} from './GameLoading';
import {Announcement} from './Announcements';
import {useGameInfo} from '../logic/GameInfo';
import {TemplateFile, TemplateStr} from '../widget/Template';
import {ChallengeIcon, FlagIcon} from '../widget/ChallengeIcon';
import {TokenWidget} from '../widget/TokenWidget';
import {UserGroupTag} from '../widget/UserGroupTag';
import {useWishData, wish} from '../wish';
import {TimestampAgo, NotFound, useReloadButton, to_auth, format_ts} from '../utils';
import {WEB_TERMINAL_ADDR, ATTACHMENT_ROOT} from '../branding';

import './Game.less';

function ChallengeAction({action, ch}) {
    /* eslint-disable react/jsx-no-target-blank */
    let info = useGameInfo();

    if(action.type==='webpage')
        return (<>
            你可以 <a href={action.url.replace(/\{\{token}}/g, info.user.token)} target="_blank">访问{action.name}</a>
        </>);
    else if(action.type==='webdocker')
        return (<>
            你可以 <a href={`https://${action.host}/docker-manager/start?${info.user.token}`} target="_blank">访问{action.name}</a>
            {' '}
            <Popover trigger="click" content={<div>
                <p>本题为每名选手分配一个独立的后端环境，参见 <a href="#/info/faq">FAQ：关于 Web 题目环境</a></p>
                <p>如果题目出现问题可以手动关闭环境，下次访问时将启动新的环境</p>
                <Button block danger onClick={()=>{
                    window.open(`https://${action.host}/docker-manager/stop?${info.user.token}`);
                }}>关闭环境</Button>
            </div>}>
                <Button size="small" style={{marginLeft: '.5em'}}><CodepenOutlined />环境控制</Button>
            </Popover>
        </>);
    else if(action.type==='terminal')
        return (<>
            你可以 <a href={WEB_TERMINAL_ADDR(action, info.user.token)} target="_blank">打开网页终端</a> 或者通过命令{' '}
            <code>nc {action.host} {action.port}</code> 连接到{action.name}
        </>);
    else if(action.type==='attachment')
        return (<>
            你可以 <a href={`${ATTACHMENT_ROOT}${ch.key}/${action.filename}`} target="_blank">下载{action.name}</a>
        </>);
}

function TouchedUsersTable({ch}) {
    let info = useGameInfo();
    let [error, data, load_data] = useWishData('get_touched_users/'+ch.key);

    let cur_uid = info.user!==null ? info.user.id : null;

    if(error)
        return <Reloader message={error.error_msg} reload={load_data} />;
    if(data===null)
        return <Skeleton />;

    return (
        <div>
            <Table
                dataSource={data.list}
                size="small"
                onRow={(record)=>{
                    if(record.uid===cur_uid)
                        return {style: {backgroundColor: '#f0f3ff'}};
                    else
                        return {};
                }}
            >
                <Table.Column
                    title="用户"
                    key="user"
                    render={(_text, record)=>(
                    <>
                        {record.nickname}{' '}
                        <UserGroupTag>{record.group_disp}</UserGroupTag>
                    </>
                    )}
                    filters={[
                        {text: '北京大学选手', value: 'pku'},
                        {text: '其他选手', value: 'other'},
                    ]}
                    onFilter={(value, record)=>(
                        value==='pku'? record.group_disp==='北京大学' :
                        value==='other'? record.group_disp!=='北京大学' :
                                true
                    )}
                    filterMultiple={false}
                />
                <Table.Column
                    title="总分"
                    key="tot_score"
                    dataIndex="tot_score"
                />
                {ch.flags.map((flag, idx)=>(
                    <Table.Column key={idx} title={flag.name || '通过本题时间'} dataIndex={['flags', idx]} render={(text)=>(
                        text ? format_ts(text) : ''
                    )} />
                ))}
            </Table>
        </div>
    );
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

function ChallengeBody({ch}) {
    let [error, data, load_data] = useWishData('challenge/'+ch.key);

    if(error)
        return <Reloader message={error.error_msg} reload={load_data} />;
    if(data===null)
        return <Skeleton />;

    return (<>
        <TemplateStr name="challenge-desc">{data.desc}</TemplateStr>
        <br />
        {data.actions.map((action, idx)=>(
            <p key={idx} className="challenge-action">
                <RightCircleOutlined />{' '}
                <ChallengeAction ch={ch} action={action} />
            </p>
        ))}
    </>);
}

function ScoreDeduction({base, cur}) {
    if(base===cur)
        return null;
    else {
        let ratio = (1-cur/base)*100;
        return (
            <span className="item-discount" title={'基础分值：'+base}>(-{ratio.toFixed(0)}%)</span>
        );
    }
}

function Challenge({ch, do_reload_list}) {
    let [display_touched_users, set_display_touched_users] = useState(false);

    return (
        <div className="challenge-body">
            <h1>{ch.title}</h1>
            <p className="challenge-stat">
                <Tag color="default">
                    基础分值 {ch.tot_base_score}
                </Tag>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={()=>set_display_touched_users(x => !x)}>
                    <Tag color="default">
                        {display_touched_users ? <UpOutlined /> : <CaretDownOutlined />}{' '}
                        共 {ch.passed_users_count} 人通过
                        {ch.touched_users_count>ch.passed_users_count && <>
                            （{ch.touched_users_count} 人部分通过）
                        </>}
                    </Tag>
                </a>
                {!!ch.metadata.author &&
                    <Tag color="default">
                        命题人：{ch.metadata.author}
                    </Tag>
                }
                {!!ch.metadata.first_blood_award_eligible &&
                    <Tag color="default">
                        <a href="#/board/first_pku">
                            <b><FireOutlined /> 解题先锋奖</b>
                        </a>
                    </Tag>
                }
            </p>
            <br />
            {!!display_touched_users && <>
                <TouchedUsersTable ch={ch} />
                <br />
            </>}
            <ChallengeBody ch={ch} />
            {ch.status==='passed' ?
                <Alert type="success" showIcon message="你已经通过此题" /> :
                <FlagInput key={ch.key} do_reload_list={do_reload_list} ch={ch} />
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
                            分值
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
                                    {ch.tot_cur_score}<span className="label-for-score">分</span>
                                    {' '}<ScoreDeduction base={ch.tot_base_score} cur={ch.tot_cur_score} />
                                </div>
                            </div>
                            {active_key===ch.key && ch.flags.length>1 &&
                                ch.flags.map((f, idx)=>(
                                    <div key={idx} className="portal-chall-row portal-chall-row-active portal-chall-row-flag">
                                        <div className="portal-chall-col-title">
                                            <FlagIcon status={f.status} /> {f.name}
                                        </div>
                                        <div className="portal-chall-col-score">
                                            {f.cur_score}<span className="label-for-score">分</span>
                                            {' '}<ScoreDeduction base={f.base_score} cur={f.cur_score} />
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
    let [last_reloaded, do_reload, reload_btn] = useReloadButton(load_data, 3, 600);
    let params = useParams();

    let active_challenge_key = params.challenge===undefined ? null : params.challenge;

    let active_challenge = useMemo(()=>{
        if(data!==null && data.challenge_list!==null)
            for(let ch of data.challenge_list)
                if(ch.key===active_challenge_key)
                    return ch;
        return null;
    }, [data, active_challenge_key]);

    useEffect(()=>{
        if(window._anticheat_report) {
            window._anticheat_report();
        }
    }, []);

    useEffect(()=>{
        if(error) {
            if(error.error==='SHOULD_AGREE_TERMS') {
                message.info({content: error.error_msg, key: 'Portal.Error', duration: 2});
                nav('/user/terms');
            }
            if(error.error==='SHOULD_UPDATE_PROFILE') {
                message.info({content: error.error_msg, key: 'Portal.Error', duration: 2});
                nav('/user/profile');
            }
        }
    }, [error, nav]);
    
    if(error) {
        return (
            <div className="slim-container">
                <Reloader message={error.error_msg} reload={()=>{
                    do_reload();
                }} />
            </div>
        );
    }

    return (
        <div className="portal-container">
            <div className="portal-sidebar">
                <div className="portal-headline">
                    <div>
                        <HistoryOutlined /> {last_reloaded!==0 && <>
                            <TimestampAgo ts={last_reloaded} />更新
                        </>}
                    </div>
                    <div>
                        <Button type="link" ref={reload_btn} onClick={()=>{
                            message.success({content: '已刷新题目数据', key: 'Portal.ManualLoadData', duration: 2});
                            do_reload();
                        }}>
                            <SyncOutlined /> 刷新题目
                        </Button>
                    </div>
                </div>

                {data===null ?
                    <Skeleton /> :
                    <>
                        <div className="portal-primary-btn">
                            {!!data.show_writeup ?
                                <Button block size="large" onClick={()=>nav('/writeup')} type="primary">
                                    <SolutionOutlined /> 提交 Writeup
                                </Button> :
                                <Button block size="large" onClick={()=>nav('/info/faq')}>
                                    <FileTextOutlined /> 选手常见问题
                                </Button>
                            }
                        </div>
                        <PortalUserInfo info={data.user_info} />
                        <PortalChallengeList list={data.challenge_list} active_key={active_challenge_key} />
                    </>
                }
            </div>
            <div className="portal-main">
                <div className="portal-headline">
                    {data!==null &&
                        <div>
                            <CarryOutOutlined /> {data.trigger.current_name.replace(/;/, '，')}
                            {!!data.trigger.next_name && <>
                                （<TimestampAgo ts={data.trigger.next_timestamp_s} delta={5} />：{data.trigger.next_name.replace(/;/, '，')}）
                            </>}
                        </div>
                    }
                    <div>
                        <Button type="link" onClick={()=>{
                            window.location.href = '#/info/triggers';
                        }}>
                            <RightCircleOutlined /> 查看赛程安排
                        </Button>
                    </div>
                </div>
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
                    <Challenge ch={active_challenge} do_reload_list={()=>load_data(false)} />:
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
                <br />
                <div className="landing-login-form">
                    <Card type="inner" size="small" bordered={false}>
                        <b>报名参赛：</b>
                        <Button type="primary" onClick={()=>to_auth('pku/redirect')}><HomeOutlined /> 北京大学登录</Button>
                        {' '}
                        <Button onClick={()=>window.location.href='#/login/other'}><GlobalOutlined /> 校外选手</Button>
                    </Card>
                </div>
            </div>
        );
    else
        return (
            <Portal />
        );
}