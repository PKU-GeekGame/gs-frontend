import {Fragment, useMemo, useState, useEffect, useReducer, useRef, useContext} from 'react';
import {useNavigate, unstable_usePrompt, useParams} from 'react-router-dom';
import {Button, Empty, Tag, Alert, Input, Tooltip, Popover, Card, App, Popconfirm} from 'antd';
import copy from 'copy-to-clipboard';
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
    GlobalOutlined,
    CarryOutOutlined,
    FileTextOutlined,
    FireOutlined,
    UserSwitchOutlined,
    FormOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    UserOutlined,
    CopyOutlined,
    BankOutlined,
} from '@ant-design/icons';

import {Reloader} from './GameLoading';
import {Announcement} from './Announcements';
import {useGameInfo, GameInfoCtx} from '../logic/GameInfo';
import {TemplateFile, TemplateStr} from '../widget/Template';
import {ChallengeIcon, FlagIcon, CategoryBadge} from '../widget/ChallengeIcon';
import {Transition} from '../widget/Transition';
import {TokenWidget} from '../widget/TokenWidget';
import {UserName, UserGroupTag, UserBadges} from '../widget/UserBadges';
import {LookingGlassLink} from '../widget/LookingGlassLink';
import {useWishData, wish, TABID} from '../wish';
import {TimestampAgo, NotFound, useReloadButton, to_auth, format_ts, ExtLink} from '../utils';
import {WEB_TERMINAL_ADDR, ATTACHMENT_ROOT, ANTICHEAT_REPORT, SYBIL_ROOT, BANNED_MSG, Logo} from '../branding';
import {TableLoader as Table} from '../widget/TableLoader';
import {Loading} from '../widget/Loading';

import './Game.less';

function LoginBanner() {
    let {message} = App.useApp();

    return (
        <div className="landing-login-form">
            <Card type="inner" size="small" bordered={false}>
                <b>报名参赛：</b>
                <Button type="primary" onClick={() => to_auth('pku/redirect', message)}><BankOutlined /> 北京大学登录</Button>
                &ensp;
                <Button type="primary" onClick={() => to_auth('carsi/login', message)}><BankOutlined /> 清华大学登录</Button>
                &ensp;
                <Button onClick={() => window.location.href = '#/login/other'}><GlobalOutlined/> 校外选手</Button>
            </Card>
        </div>
    );
}

function ChallengeAction({action, ch}) {
    /* eslint-disable react/jsx-no-target-blank */
    let info = useGameInfo();
    let {message} = App.useApp();

    function report_click() {
        void fetch(`${SYBIL_ROOT}event?name=visit_action&tabid=${TABID}`, {
            method: 'POST',
            credentials: 'include',
            priority: 'low',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([ch.key, action.name]),
        });
    }

    if(action.type==='webpage')
        return (<>
            你可以 <ExtLink onPointerDown={report_click} href={action.url.replace(/\{\{token}}/g, info.user.token)}>访问{action.name}</ExtLink>
        </>);
    else if(action.type==='webdocker')
        return (<>
            你可以 <ExtLink onPointerDown={report_click} href={`https://${action.host}/docker-manager/start?${info.user.token}`}>访问{action.name}</ExtLink>
            {' '}
            <Popover trigger="click" content={<div>
                <p>本题为每名选手分配一个独立的后端环境，参见 <a href="#/info/faq">FAQ：关于 Web 题目环境</a></p>
                <p>如果题目出现问题可以手动关闭环境，下次访问时将启动新的环境</p>
                <Button block danger onClick={()=>{
                    window.open(`https://${action.host}/docker-manager/stop?${info.user.token}`);
                }}>关闭环境</Button>
            </div>}>
                <Button size="small" className="challenge-action-auxbtn"><CodepenOutlined />环境控制</Button>
            </Popover>
        </>);
    else if(action.type==='terminal')
        return (<>
            你可以 <ExtLink onPointerDown={report_click} href={WEB_TERMINAL_ADDR(action, info.user.token)}>打开网页终端</ExtLink> 或者通过命令{' '}
            <code>nc {action.host} {action.port}</code> 连接到{action.name}
        </>);
    else if(action.type==='attachment') {
        let url = `${ATTACHMENT_ROOT}${ch.key}/${action.filename}?token=${info.user.token}`;
        return (<>
            你可以 <ExtLink href={url}>下载{action.name}</ExtLink>
            <Popover trigger="click" content={<div>
                <p>可以在未登录比赛平台的设备上通过链接下载附件</p>
                <p>下载链接包含你的个人 Token，与他人分享将视为作弊</p>
                <Button block onClick={()=>{
                    if(copy(new URL(url, location.href).href))
                        message.success({content: '已复制', key: 'ChallengeActionAttachment', duration: 2});
                }}>复制下载链接</Button>
            </div>}>
                <Button size="small" className="challenge-action-auxbtn"><CopyOutlined />复制链接</Button>
            </Popover>
        </>);
    }
}

function TouchedUsersTable({ch}) {
    let info = useGameInfo();
    let [error, data, load_data] = useWishData('get_touched_users/'+ch.key);

    let cur_uid = info.user!==null ? info.user.id : null;

    if(error)
        return <Reloader message={error.error_msg} reload={load_data} />;
    if(!data)
        return <Loading height={350} />;

    return (
        <div>
            <Table
                dataSource={data.list}
                size="small"
                rowKey="uid"
                onRow={(record)=>{
                    if(record.uid===cur_uid)
                        return {className: 'active-bg-row'};
                    else
                        return {};
                }}
            >
                <Table.Column
                    title="昵称"
                    key="user"
                    render={(_text, record)=>(
                    <>
                        <UserName name={record.nickname} />{' '}
                        <UserGroupTag>{record.group_disp}</UserGroupTag>
                        <UserBadges badges={record.badges} />
                    </>
                    )}
                    filters={[
                        {text: '北京大学选手', value: 'pku'},
                        {text: '清华大学选手', value: 'thu'},
                        {text: '其他选手', value: 'other'},
                    ]}
                    onFilter={(value, record)=>(
                        value.uid===0 ? true : (
                            value==='pku'? record.group_disp==='北京大学' :
                            value==='thu'? record.group_disp==='清华大学' :
                            value==='other'? (record.group_disp!=='北京大学' && record.group_disp!=='清华大学') :
                                true
                        )
                    )}
                    filterMultiple={false}
                />
                <Table.Column
                    title="总分"
                    key="tot_score"
                    dataIndex="tot_score"
                    render={(score, record) => (
                        record.uid ? <LookingGlassLink uid={record.uid} nickname={record.nickname}>{score}</LookingGlassLink> : null
                    )}
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
    let [flag, set_flag] = useState('');
    let {message} = App.useApp();

    function do_submit() {
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
                set_flag('');
                if(res.error)
                    message.error({content: res.error_msg, key: 'FlagInput', duration: 3});
                else {
                    message.success({content: 'Flag正确', key: 'FlagInput', duration: 2});
                    do_reload_list();
                }
            });
    }

    return (
        <div>
            <Input.Search
                value={flag}
                onChange={(e)=>set_flag(e.target.value)}
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
        return (<>
            <Reloader message={error.error_msg} reload={load_data} />
            <br />
        </>);
    if(data===null)
        return (<>
            <Loading />
            <br />
        </>);

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

function Feedback({ch}) {
    let [state, set_state] = useState('notice');
    let [content, set_content] = useState('');
    let {message} = App.useApp();

    function submit_feedback() {
        set_state('submitting');
        wish('submit_feedback', {
            challenge_key: ch.key,
            feedback: content,
        })
            .then((res)=>{
                if(res.error) {
                    message.error({content: res.error_msg, key: 'Feedback', duration: 3});
                    set_state('draft');
                }
                else {
                    message.success({content: '反馈提交成功', key: 'Feedback', duration: 2});
                    set_state('done');
                }
            });
    }

    unstable_usePrompt({
        message: '反馈尚未提交，确定要离开吗？',
        when: () => state==='draft' && content,
    });

    return (
        <div className="feedback-form">
            {state==='notice' ? <>
                <ul>
                    <li>使用此功能来<b>单方面反馈题目中的问题</b>，例如存在非预期解、题目环境与附件不符、题目描述具有误导性。</li>
                    <li>出题人<b>不会单独回复反馈</b>，但可能依据反馈内容来修复题目问题、发布补充说明或者撰写第二阶段提示。</li>
                    <li>如果希望咨询出题人并获得回复，请<b>在选手群联系管理员</b>，而非提交反馈。</li>
                    <li>请注意<b>每小时只能提交一次反馈</b>。</li>
                </ul>
                <Button block type="primary" onClick={()=>set_state('draft')}>
                    <FormOutlined /> 反馈问题
                </Button>
            </> : <>
                <div>
                    <Input.TextArea
                        value={content} onChange={(e)=>set_content(e.target.value)}
                        placeholder="（反馈内容……）"
                        disabled={state!=='draft'}
                        maxLength={1200} showCount={true}
                        autoSize={{minRows: 5, maxRows: 10}}
                    />
                </div>
                <br />
                <Popconfirm
                    title={<>请注意<b>出题人不会单独回复反馈</b>，<br />而且<b>每小时只能提交一次</b>。</>}
                    showCancel={false}
                    okText="确认提交"
                    onConfirm={submit_feedback}
                >
                    <Button block type="primary" disabled={!content || state!=='draft'}>
                        <FormOutlined /> {state==='done' ? '已' : state==='submitting' ? '正在' : ''}提交反馈
                    </Button>
                </Popconfirm>
            </>}
        </div>
    );
}

function ScoreDeduction({ch, flag, show_pass_count}) {
    let base_score, cur_score, passed_count, touched_count;
    if(ch) {
        base_score = ch.tot_base_score;
        cur_score = ch.tot_cur_score;
        passed_count = ch.passed_users_count;
        touched_count = ch.touched_users_count;
    } else {
        base_score = flag.base_score;
        cur_score = flag.cur_score;
        passed_count = flag.passed_users_count;
        touched_count = passed_count;
    }

    let ratio = base_score===0 ? 0 : (1-cur_score/base_score)*100;

    let tooltip = `基础分值 ${base_score}，通过人数 ${passed_count}` + (
        touched_count>passed_count ? `，部分通过人数 ${touched_count}` : ''
    );

    let item_full = (
        <span className="item-discount-full">
            (-{ratio.toFixed(0)}%)&ensp;<UserOutlined />{passed_count}{touched_count>passed_count ? '+' : ''}
        </span>
    );

    let item_selected;

    if(show_pass_count) {
        item_selected = touched_count===0 ? null : (
            <span className="item-discount-selected"><UserOutlined />{passed_count}{touched_count>passed_count ? '+' : ''}</span>
        );
    } else {
        item_selected = base_score===cur_score ? null : (
            <span className="item-discount-selected">(-{ratio.toFixed(0)}%)</span>
        );
    }

    return (
        <span className="item-discount" title={tooltip}>
            {item_full}{item_selected}
        </span>
    );
}

function Challenge({ch, do_reload_list}) {
    let info = useGameInfo();
    let [display_panel, toggle_panel] = useReducer(((cur, next) => cur===next ? '' : next), '');

    return (
        <div className="challenge-body">
            <div className="challenge-titlebox">
                <span className="challenge-titlebox-title">{ch.title}</span>
                <span className="challenge-titlebox-key">{ch.key}</span>
            </div>
            <p className="challenge-stat">
                <Tag color="default">
                    基础分值 {ch.tot_base_score}
                </Tag>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={()=>toggle_panel('touched_users')}>
                    <Tag color="default">
                        {display_panel==='touched_users' ? <UpOutlined /> : <CaretDownOutlined />}{' '}
                        共 {ch.passed_users_count} 人通过
                        {ch.touched_users_count>ch.passed_users_count && <>
                            （{ch.touched_users_count} 人部分通过）
                        </>}
                    </Tag>
                </a>
                {!!info.feature.submit_flag &&
                    <a onClick={() => toggle_panel('feedback')}>
                        <Tag color="default">
                            {display_panel==='feedback' ? <UpOutlined/> : <CaretDownOutlined/>}{' '}
                            反馈问题
                        </Tag>
                    </a>
                }
                {!!ch.metadata.author &&
                    <Tag color="default">
                        命题人：{ch.metadata.author}
                    </Tag>
                }
                {!!(ch.metadata.first_blood_award_eligible && info.user.group==='pku') &&
                    <Tag color="default">
                        <a href="#/board/first_pku">
                            <b><FireOutlined/> 解题先锋奖</b>
                        </a>
                    </Tag>
                }
            </p>
            <br />
            <Transition cur={display_panel} skipexit={display_panel===''}>
                {display_panel==='touched_users' && <>
                    <TouchedUsersTable ch={ch} />
                    <br />
                </>}
                {display_panel==='feedback' && <>
                    <Feedback ch={ch} />
                    <br />
                </>}
            </Transition>
            <ChallengeBody ch={ch} />
            {
                ch.status.startsWith('passed') ?
                    <Alert type="success" showIcon message="你已经通过此题" /> :
                !info.feature.submit_flag ?
                    <Alert type="info" showIcon message="现在不允许提交 Flag" /> :
                    <FlagInput key={ch.key} do_reload_list={do_reload_list} ch={ch} />
            }
            <br />
            <TokenWidget />
        </div>
    );
}

function TrendMark({current, reloaded, reversed}) {
    let [prev, set_prev] = useState(null);
    let [active, set_active] = useState(false);
    let mem = useRef({reloaded: reloaded, value: current});

    useEffect(()=>{
        if(reloaded===mem.current.reloaded)
            return;

        let prev_val = mem.current.value;
        mem.current.value = current;
        mem.current.reloaded = reloaded;

        set_prev(prev_val);

        set_active(true);
        let timer = setTimeout(()=>{
            set_active(false);
        }, 1500);

        return ()=>{
            clearTimeout(timer);
        };
    }, [current, reloaded]);

    let delta = (current && prev) ? current-prev : null;
    if(delta===null)
        return null;

    let clsname = delta===0 ? 'keep' : (reversed ? delta<0 : delta>0) ? 'up' : 'down';
    let shown_delta = Math.abs(delta);
    return (
        <span className={`trend-mark${active ? ' trend-mark-active' : ''} trend-mark-${clsname}`}>{
            clsname==='up' ? <><ArrowUpOutlined />{shown_delta}</> :
            clsname==='down' ? <><ArrowDownOutlined />{shown_delta}</> :
                'KEEP'
        }</span>
    )
}

function PortalUserInfo({info, last_reloaded}) {
    let nav = useNavigate();
    let tot_score_by_cat = info.tot_score_by_cat ? info.tot_score_by_cat.filter((cat)=>cat[0]!=='Tutorial') : [];

    return (
        <div className="portal-user-info" onClick={()=>nav('/board/'+info.board_key)}>
            <div className="portal-user-info-status">
                总分 <b>{info.tot_score}</b><TrendMark reversed={false} current={info.tot_score} reloaded={last_reloaded} />{'，'}
                {info.board_name} <b>#{info.board_rank || 'N/A'}</b><TrendMark reversed={true} current={info.board_rank} reloaded={last_reloaded} />
            </div>
            {tot_score_by_cat.length>0 &&
                <div className="portal-user-info-cat">
                    <PieChartFilled />{' '}
                    {tot_score_by_cat.map((cat, idx)=>(
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

function PortalChallengeList({list, active_key, set_active_key}) {
    let [show_pass_count, set_show_pass_count] = useState(false);

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
                            <span className="portal-chall-mode-switch-btn" onClick={()=>set_show_pass_count(!show_pass_count)}>
                                <Tooltip title={<>当前显示：{show_pass_count ? '总通过人数' : '动态分值系数'}<br />点击切换</>}>
                                    (<UserSwitchOutlined />)
                                </Tooltip>
                            </span>
                        </div>
                    </div>
                    {list.map((ch)=>(
                        <Fragment key={ch.key}>
                            <div
                                className={`portal-chall-row${active_key===ch.key ? ' portal-chall-row-active' : ''}`}
                                onClick={()=>set_active_key(ch.key)}
                            >
                                <div className="portal-chall-col-title">
                                    <CategoryBadge color={ch.category_color}>{ch.category}</CategoryBadge>
                                    <ChallengeIcon status={ch.status} /> {ch.title}
                                    {ch.flags.length>1 && <span className="portal-chall-caret"><CaretDownOutlined /></span>}
                                </div>
                                <div className="portal-chall-col-score">
                                    {ch.tot_cur_score}<span className="label-for-score">分</span>
                                    {' '}<ScoreDeduction ch={ch} show_pass_count={show_pass_count} />
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
                                            {' '}<ScoreDeduction flag={f} show_pass_count={show_pass_count} />
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

function BannedSplash({error_msg, splash_msg}) {
    let [popup, set_popup] = useState(true);
    let nav = useNavigate();

    return (
        <div className="slim-container">
            <Alert type="error" message={error_msg} showIcon/>
            {popup===true && <div className="banned-splash">
                <div><Logo/></div>
                <h1>你号没了</h1>
                <p>{splash_msg}</p>
                <div>
                    <Button type="text" danger={true} size="large" onClick={() => nav('/info/announcements')}>查看比赛公告</Button>
                    &ensp;
                    <Button type="text" danger={true} size="large" onClick={() => set_popup(false)}>知道了</Button>
                </div>
            </div>}
            <br/>
            <TemplateFile name="game"/>
        </div>
    );
}

function Portal() {
    let [error, data, load_data] = useWishData('game');
    let {info, reload_info} = useContext(GameInfoCtx);
    let nav = useNavigate();
    let [last_reloaded, do_reload, reload_btn] = useReloadButton(load_data, 3, 180);
    let {challenge: active_challenge_key} = useParams();
    let {message} = App.useApp();

    useEffect(() => {
        if(data && info.cur_tick!==data.cur_tick) {
            reload_info(); // policy may change, so refresh the whole ui
        }
    }, [info, data]);

    active_challenge_key = active_challenge_key || null;
    let shown_challenge_key = info.user ? active_challenge_key : null;

    function goto_challenge(k) {
        nav('/game/'+k);
    }

    let shown_challenge = useMemo(()=>{
        if(data!==null && data.challenge_list!==null)
            for(let ch of data.challenge_list)
                if(ch.key===shown_challenge_key)
                    return ch;
        return null;
    }, [data, shown_challenge_key]);

    useEffect(()=>{
        void ANTICHEAT_REPORT();
    }, [shown_challenge_key]);

    useEffect(()=>{
        function on_focus() {
            void ANTICHEAT_REPORT();
        }

        window.addEventListener('focus', on_focus);
        return ()=>{
            window.removeEventListener('focus', on_focus);
        };
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

    if(active_challenge_key==='try-try-jiu-die-die')
        return (
            <BannedSplash error_msg="欸，就是玩~" splash_msg="其实你号还在，但总有人想体验这种别样的乐趣。不是吗？" />
        );
    if(error) {
        if(error.error==='USER_BANNED')
            return (
                <BannedSplash error_msg={error.error_msg} splash_msg={BANNED_MSG} />
            );
        else
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
                    <Loading /> :
                    <>
                        <div className="portal-primary-btn">
                            {!!data.show_writeup ?
                                <Button block size="large" onClick={()=>nav('/writeup')} type="primary">
                                    <SolutionOutlined /> 提交 Writeup
                                </Button> :
                            info.user===null ?
                                <Alert type="info" showIcon message="比赛进行中，报名参赛方可查看题目" /> :
                                <Button block size="large" onClick={()=>nav('/info/faq')}>
                                    <FileTextOutlined /> 选手常见问题
                                </Button>
                            }
                        </div>
                        {data.user_info!==null &&
                            <PortalUserInfo info={data.user_info} last_reloaded={last_reloaded} />
                        }
                        <PortalChallengeList list={data.challenge_list} active_key={active_challenge_key} set_active_key={(k)=>{
                            if(info.user)
                                goto_challenge(k)
                            else
                                message.info({content: '报名参赛方可查看题目', key: 'Portal.GotoChallenge', duration: 2});
                        }} />
                    </>
                }
            </div>
            <div className="portal-main">
                {data!==null && data.trigger!==null &&
                    <div className="portal-headline">
                        <div>
                            <CarryOutOutlined /> {data.trigger.current_name.replace(/;/, '，')}
                            {!!data.trigger.next_name && <>
                                （<TimestampAgo ts={data.trigger.next_timestamp_s} delta={5} />：{data.trigger.next_name.replace(/;/, '，')}）
                            </>}
                        </div>
                        <div>
                            <Button type="link" onClick={()=>{
                                window.location.href = '#/info/triggers';
                            }}>
                                <RightCircleOutlined /> 查看赛程安排
                            </Button>
                        </div>
                    </div>
                }
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
                <Transition cur={shown_challenge_key}>
                    {shown_challenge!==null ?
                        <Challenge ch={shown_challenge} do_reload_list={()=>{window.scroll(0, 0); do_reload();}} />:
                    (shown_challenge_key!==null && data!==null) ?
                        <NotFound /> :
                        <>
                            <TemplateFile name="game" />
                            {info.user===null && <>
                                <br />
                                <LoginBanner />
                            </>}
                        </>
                    }
                </Transition>
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
                <LoginBanner />
            </div>
        );
    else
        return (
            <Portal />
        );
}