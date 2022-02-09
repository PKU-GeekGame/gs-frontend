import {useRef, useEffect, Fragment, useMemo} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Skeleton, message, Alert, Button, Card, Empty, Tag} from 'antd';
import {PieChartFilled, CheckSquareOutlined, SyncOutlined, HistoryOutlined, RightCircleOutlined} from '@ant-design/icons';

import {Reloader} from './GameLoading';
import {useGameInfo} from '../ctx/GameInfo';
import {TemplateFile} from '../widget/Template';
import {useWishData} from '../wish';
import {TimestampAgo, NotFound} from '../utils';

import './Game.less';
import {ChallengeIcon, FlagIcon} from '../widget/ChallengeIcon';
import {Announcement} from './Announcements';

function Challenge({ch}) {
    return (
        <div>challenge {ch.id}: {ch.title}</div>
    )
}

function PortalUserInfo({info}) {
    return (
        <div className="portal-user-info">
            <div className="portal-user-info-status">{info.status_line}</div>
            {info.tot_score_by_cat!==null &&
                <div>
                    <PieChartFilled />
                    {info.tot_score_by_cat.map((cat, idx)=>(
                        <>
                            {idx!==0 ? ' + ' : null}
                            {cat[0]} {cat[1]}
                        </>
                    ))}
                </div>
            }
        </div>
    )
}

function PortalChallengeList({list, active_id}) {
    let nav = useNavigate();

    return (
        <div className="portal-chall-list">
            <div className="portal-chall-row portal-chall-header">
                <div className="portal-chall-col-title">
                    题目名称
                </div>
                <div className="portal-chall-col-score">
                    分值 / <small><CheckSquareOutlined /> 通过人数</small>
                </div>
            </div>
            {list===null ?
                <Card size="small">目前不能查看题目</Card> :
                list.map((ch)=>(
                    <Fragment key={ch.id}>
                        <div
                            className={`portal-chall-row${active_id===ch.id ? ' portal-chall-row-active' : ''}`}
                            onClick={()=>nav('/game/'+ch.id)}
                        >
                            <div className="portal-chall-col-title">
                                <span className="portal-chall-category-badge">
                                    <Tag color={ch.category_color}>{ch.category}</Tag>
                                </span>
                                <ChallengeIcon status={ch.status} /> {ch.title}
                            </div>
                            <div className="portal-chall-col-score">
                                {ch.tot_cur_score} / <small><CheckSquareOutlined /> {ch.passed_users_count}</small>
                            </div>
                        </div>
                        {active_id===ch.id && ch.flags.length>1 &&
                            ch.flags.map((f, idx)=>(
                                <div key={idx} className="portal-chall-row portal-chall-row-active portal-chall-row-flag">
                                    <div className="portal-chall-col-title">
                                        <FlagIcon status={f.status} /> {f.name}
                                    </div>
                                    <div className="portal-chall-col-score">
                                        {f.cur_score} / <small><CheckSquareOutlined /> {ch.passed_users_count}</small>
                                    </div>
                                </div>
                            ))
                        }
                    </Fragment>
                ))
            }
            {list!==null && list.length===0 &&
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无题目" />
            }
        </div>
    )
}

function Portal() {
    let [error, data, load_data] = useWishData('game');
    let nav = useNavigate();
    let last_reloaded = useRef(0);
    let reload_btn = useRef(null);
    let params = useParams();

    let active_challenge_id = params.challenge===undefined ? null : parseInt(params.challenge);

    let active_challenge = useMemo(()=>{
        if(data!==null)
            for(let ch of data.challenge_list)
                if(ch.id===active_challenge_id)
                    return ch;
        return null;
    }, [data, active_challenge_id]);

    useEffect(()=>{
        last_reloaded.current = +new Date();
    }, []);

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
                <Reloader message={error.error_msg} reload={load_data} />
            </div>
        );
    }

    function manual_load_data() {
        if(reload_btn.current)
            reload_btn.current.disabled = true;
        last_reloaded.current = +new Date();
        setTimeout(()=>{
            if((+new Date())-last_reloaded.current > 2500)
                reload_btn.current.disabled = false;
        }, 3000);

        message.success({content: '已刷新题目数据', key: 'Portal.ManualLoadData', duration: 2});
        load_data();
    }

    return (
        <div className="portal-container">
            <div className="portal-sidebar">
                <div className="portal-reloader">
                    <div>
                        <HistoryOutlined /> <TimestampAgo ts={last_reloaded.current/1000} />更新
                    </div>
                    <div>
                        <Button type="link" ref={reload_btn} onClick={manual_load_data}>
                            <SyncOutlined /> 刷新题目
                        </Button>
                    </div>
                </div>

                {data===null ?
                    <Skeleton /> :
                    <>
                        <PortalUserInfo info={data.user_info} />
                        <PortalChallengeList list={data.challenge_list} active_id={active_challenge_id} />
                    </>
                }
            </div>
            <div className="portal-main">
                {data!==null && data.last_announcement!==null &&
                    <Announcement
                        announcement={data.last_announcement}
                        extra={
                            <Button type="link" onClick={()=>nav('/info')}>
                                <RightCircleOutlined /> 查看所有公告
                            </Button>
                        }
                    />
                }
                {active_challenge_id===null ?
                    <TemplateFile name="game" /> :
                    active_challenge===null ?
                        <NotFound /> :
                        <Challenge ch={active_challenge} />
                }
            </div>
        </div>
    )
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