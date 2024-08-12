import {useState, useEffect, memo} from 'react';
import {Alert, Skeleton, Tooltip, Button, Tag, App} from 'antd';
import {HistoryOutlined, SyncOutlined, FireOutlined} from '@ant-design/icons';
import LazyLoad, {forceCheck} from 'react-lazyload';

import {Reloader} from './GameLoading';
import {ChallengeIcon, FlagIcon} from '../widget/ChallengeIcon';
import {useWishData} from '../wish';
import {format_ts, TimestampAgo, useReloadButton} from '../utils';
import {UserBadges, UserName, UserGroupTag} from '../widget/UserBadges';
import {useGameInfo} from '../logic/GameInfo';
import {LookingGlassLink} from '../widget/LookingGlassLink';
import {TopStarPlotLoader} from '../widget/TopStarPlotLoader';
import {TableLoader as Table} from '../widget/TableLoader';

import './Board.less';

function ChallengeStatus({ch, record}) {
    return (
        <div>
            <p><b>{ch.title}</b> ({ch.category})</p>
            {ch.flags.map((name, idx)=>{
                let flg = record.flag_status[`${ch.key}_${idx}`] || null;
                return (
                    <p key={idx}>
                        <FlagIcon status={flg===null ? 'untouched' : 'passed'} />{' '}
                        {name}：
                        {flg===null ? '尚未通过' : `(+${flg[1]}) ${format_ts(flg[0])}`}
                    </p>
                );
            })}
        </div>
    );
}

function ChallengeTooltip({ch, record, marginLeft}) {
    let [state, set_state] = useState(0);

    let icon = (
        <span className={'board-challenge-status-icon' + (marginLeft ? ' board-challenge-status-marginleft' : '')}>
            <ChallengeIcon status={record.challenge_status[ch.key] || 'untouched'} />
        </span>
    );

    return (
        <span onMouseEnter={()=>set_state(1)} onMouseLeave={()=>set_state(2)}>
            {state===0 ? icon : <Tooltip
                title={<ChallengeStatus ch={ch} record={record}/>}
                placement="topRight" align={{offset: [9, -1]}}
                open={state===1} trigger={[]}
                overlayClassName="board-challenge-status-tooltip" autoAdjustOverflow={false}
            >
                {icon}
            </Tooltip>}
        </span>
    );
}

function ScoreBoardContent({data, last_reloaded}) {
    let info = useGameInfo();
    let cur_uid = info.user!==null ? info.user.id : null;

    let n_width = 1.1 * data.challenges.length;
    for(let i=1; i<data.challenges.length; i++)
        if(data.challenges[i].category!==data.challenges[i-1].category)
            n_width += .55;

    let challenges_placeholder = (
        <div style={{height: '1.5em', width: `${1.5*n_width}em`, backgroundColor: '#eee'}} />
    );

    useEffect(()=>{
        forceCheck();
    }, [data]);

    return (
        <div className="scoreboard">
            <TopStarPlotLoader plotkey={last_reloaded} data={data} single={false} />
            <br />
            <Table
                size="small"
                dataSource={data.list}
                pagination={false}
                rowKey="rank"
                scroll={{
                    x: 'max-content',
                }}
                onRow={(record)=>{
                    if(record.uid===cur_uid)
                        return {className: 'active-bg-row'};
                    else
                        return {};
                }}
            >
                <Table.Column title="#" dataIndex="rank" />
                <Table.Column title="昵称" key="name" className="board-col-bold" render={(_text, record)=>(
                    <LazyLoad
                        once={true} offset={150}
                        placeholder={record.nickname}
                    >
                        <UserName name={record.nickname} />
                        {record.group_disp===null ? null : <>&nbsp;&nbsp;<UserGroupTag>{record.group_disp}</UserGroupTag></>}
                        <UserBadges badges={record.badges} />
                    </LazyLoad>
                )} />
                <Table.Column title="总分" dataIndex="score" className="board-col-bold" render={(text, record)=>(
                    <LookingGlassLink uid={record.uid} nickname={record.nickname}>{text}</LookingGlassLink>
                )} />
                <Table.Column title="最后提交时间" dataIndex="last_succ_submission_ts" render={(text)=>(
                    format_ts(text)
                )} />
                <Table.Column title="答题进度" key="challenges" render={(_text, record)=>(
                    <LazyLoad
                        once={true} offset={150}
                        placeholder={challenges_placeholder}
                    >
                        {data.challenges.map((ch, idx)=>(
                            <ChallengeTooltip key={ch.key} ch={ch} record={record} marginLeft={idx>0 && ch.category!==data.challenges[idx-1].category} />
                        ))}
                    </LazyLoad>
                )} />
            </Table>
        </div>
    );
}

function FirstBloodBoardContent({data}) {
    let info = useGameInfo();
    let cur_uid = info.user!==null ? info.user.id : null;

    let disp_data = data.list.flatMap((ch)=>(
        ch.flags.map((f, idx)=>({
            ...f,

            challenge_title: ch.title,
            challenge_metadata: ch.metadata,
            flags_count: ch.flags.length,
            flag_idx0: idx,
            key: `${ch.key}_${idx}`
        }))
    ));

    return (
        <Table
            size="small"
            dataSource={disp_data}
            pagination={false}
            rowKey="key"
            scroll={{
                x: 'max-content',
            }}
            onRow={(record)=>{
                if(record.uid===cur_uid)
                    return {className: 'active-bg-row'};
                else
                    return {};
            }}
        >
            <Table.Column title="题目" dataIndex="challenge_title" className="board-col-bold" onCell={(record)=>({
                rowSpan: record.flag_idx0===0 ? record.flags_count : 0,
            })} />
            <Table.Column title="Flag" dataIndex="flag_name" render={(text, record)=>(<>
                {text===null ? (
                    record.flags_count>1 ? '解出所有 Flag' : '解出 Flag'
                ) : text}
                {!!(text===null && record.challenge_metadata.first_blood_award_eligible) &&
                    <Tooltip title="首个完全解出的校内选手可获得此题的解题先锋奖">
                        {' '}<Tag color="#a00">
                            <FireOutlined twoToneColor="red" /> 解题先锋奖
                        </Tag>
                    </Tooltip>
                }
            </>)} />
            <Table.Column title="一血获得者" key="user" render={(_text, record)=>(
                record.nickname!==null &&
                    <>
                        <UserName name={record.nickname} />
                        {record.group_disp===null ? null : <>&nbsp;&nbsp;<UserGroupTag>{record.group_disp}</UserGroupTag></>}
                        <UserBadges badges={record.badges} />
                    </>
            )} />
            <Table.Column title="提交时间" dataIndex="timestamp" render={(text)=>(
                text===null ? null : format_ts(text)
            )} />
        </Table>
    );
}

function BoardContent({data, last_reloaded}) {
    if(data.type==='score')
        return <ScoreBoardContent data={data} last_reloaded={last_reloaded} />;
    else if(data.type==='firstblood')
        return <FirstBloodBoardContent data={data} last_reloaded={last_reloaded} />;
    else
        return <Alert type="error" message={`未知排行榜类型 ${data.type}`} showIcon />;
}

export const Board = memo(function Board({name}) {
    let [error, data, load_data] = useWishData('board/'+name);
    let [last_reloaded, do_reload, reload_btn] = useReloadButton(load_data, 3, 300);
    let {message} = App.useApp();

    if(error)
        return (
            <Reloader message={error.error_msg} reload={()=>{
                do_reload();
            }} />
        );

    return (
        <div>
            <div className="board-reloader">
                <div>
                    <HistoryOutlined /> {last_reloaded!==0 && <>
                        <TimestampAgo ts={last_reloaded} />更新（{format_ts(last_reloaded)}）
                    </>}
                </div>
                <div>
                    <Button type="link" ref={reload_btn} onClick={()=>{
                        message.success({content: '已刷新排行榜', key: 'Board.ManualLoadData', duration: 2});
                        do_reload();
                    }}>
                        <SyncOutlined /> 刷新排行榜
                    </Button>
                </div>
            </div>
            {data===null ?
                <Skeleton /> :
                <div>
                    {!!data.desc && <>
                        <Alert type="info" message={data.desc} showIcon />
                        <br />
                    </>}
                    <BoardContent data={data} last_reloaded={last_reloaded} />
                </div>
            }
        </div>
    );
});