import {useState, useEffect, memo} from 'react';
import {Alert, Tooltip, Button, Tag, App} from 'antd';
import {HistoryOutlined, SyncOutlined, FireOutlined} from '@ant-design/icons';
import LazyLoad, {forceCheck} from 'react-lazyload';

import {Reloader} from './GameLoading';
import {ChallengeIcon, FlagIcon, ChallengeBadge} from '../widget/ChallengeIcon';
import {ChallengeBadgeModeSwitcher} from '../widget/ChallengeAttrs';
import {useWishData} from '../wish';
import {format_ts, TimestampAgo, useReloadButton} from '../utils';
import {UserBadges, UserName, UserGroupTag} from '../widget/UserBadges';
import {useGameInfo} from '../logic/GameInfo';
import {LookingGlassLink} from '../widget/LookingGlassLink';
import {TopStarPlotLoader} from '../widget/TopStarPlotLoader';
import {TableLoader as Table} from '../widget/TableLoader';

import './Board.less';
import {Loading} from '../widget/Loading';

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
                classNames={{root: "board-challenge-status-tooltip"}}
                autoAdjustOverflow={false} destroyOnHidden={true}
            >
                {icon}
            </Tooltip>}
        </span>
    );
}

function ChallengeTooltips({challenges, record}) {
    return challenges.map((ch, idx)=>(
        <ChallengeTooltip key={ch.key} ch={ch} record={record} marginLeft={idx>0 && ch.category!==challenges[idx-1].category} />
    ));
}

function ScoreBoardContent({data, last_reloaded}) {
    let info = useGameInfo();
    let cur_uid = info.user!==null ? info.user.id : null;

    /* // no need to lazyload challenges because we use pagination instead

    let n_width = 1.1 * data.challenges.length;
    for(let i=1; i<data.challenges.length; i++)
        if(data.challenges[i].category!==data.challenges[i-1].category)
            n_width += .55;

    let challenges_placeholder = (
        <div className="scoreboard-challenges-placeholder" style={{width: `${1.5*n_width}em`}} />
    );

    useEffect(()=>{
        forceCheck();
    }, [data]);

    */

    let showing_idx = 0;
    if(cur_uid) {
        for(let idx in data.list) {
            idx = parseInt(idx, 10);
            if(data.list[idx].uid === cur_uid) {
                showing_idx = idx;
                break;
            }
        }
    }

    return (
        <div className="scoreboard">
            <TopStarPlotLoader plotkey={last_reloaded} data={data} single={false} />
            <br />
            <Table
                size="small"
                dataSource={data.list}
                pagination={{
                    position: ['bottomCenter'],
                    defaultPageSize: 20,
                    defaultCurrent: 1 + Math.floor(showing_idx / 20),
                    pageSizeOptions: [10, 20, 50],
                    showSizeChanger: true,
                    hideOnSinglePage: false,
                    size: 'default',
                    showTotal: (total, range) => `#${range[0]} ~ #${range[1]}`,
                }}
                rowKey="idx"
                scroll={{
                    x: 'max-content',
                }}
                onRow={(record)=>{
                    if(cur_uid && record.uid===cur_uid)
                        return {className: 'active-bg-row'};
                    else
                        return {};
                }}
                sticky={true}
            >
                <Table.Column title="#" dataIndex="rank" align="right" />
                <Table.Column title="队伍" key="name" className="board-col-bold" render={(_text, record)=>(<>
                    <UserName name={record.nickname} />
                    {record.group_disp===null ? null : <>&ensp;<UserGroupTag>{record.group_disp}</UserGroupTag></>}
                    <UserBadges badges={record.badges} />
                </>)} />
                <Table.Column title="最终成绩" dataIndex="normalized_score" className="board-col-bold" width="85px" render={(v)=>v.toFixed(2)} />
                <Table.Column title="理论赛" dataIndex="score_offset" className="board-col-bold" width="75px" />
                <Table.Column title="实践赛" dataIndex="score" className="board-col-bold" width="75px" render={(text, record)=>(
                    <LookingGlassLink uid={record.uid} nickname={record.nickname}>{text}</LookingGlassLink>
                )} />
                <Table.Column title="实践赛答题进度" key="challenges" render={(_text, record)=>(
                    <ChallengeTooltips record={record} challenges={data.challenges} />
                )} />
                {/* <Table.Column title="最后提交时间" dataIndex="last_succ_submission_ts" render={(text)=>(
                    text ? format_ts(text) : '--'
                )} /> */}
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

            challenge_key: ch.key,
            challenge_title: ch.title,
            challenge_metadata: ch.metadata,
            challenge_category: ch.category,
            challenge_category_color: ch.category_color,
            flags_count: ch.flags.length,
            flag_idx0: idx,
            key: `${ch.key}_${idx}`
        }))
    ));

    // to avoid width collapse when no data
    let spanner = <span style={{display: 'inline-block', width: '5em'}} />;

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
                if(cur_uid && record.uid===cur_uid)
                    return {className: 'active-bg-row'};
                else
                    return {};
            }}
            sticky={true}
        >
            <Table.Column
                title={<>题目<ChallengeBadgeModeSwitcher />&ensp;</>}
                dataIndex="challenge_title" align="right" className="firstbloodboard-challenge-cell"
                onCell={(record)=>({
                    rowSpan: record.flag_idx0===0 ? record.flags_count : 0,
                })}
                render={(text, record)=>(<>
                    <ChallengeBadge challenge_key={record.challenge_key} category={record.challenge_category} category_color={record.challenge_category_color} />
                    <b>{text}&ensp;</b>
                </>)}
            />
            <Table.Column title="Flag" dataIndex="flag_name" render={(text, record)=>(<>
                {text===null ? (
                    record.flags_count>1 ? '解出所有 Flag' : '解出 Flag'
                ) : text}
            </>)} />
            <Table.Column title="一血队伍" key="user" render={(_text, record)=>(
                record.nickname===null ? spanner :
                    <>
                        <UserName name={record.nickname} />
                        {record.group_disp===null ? null : <>&ensp;<UserGroupTag>{record.group_disp}</UserGroupTag></>}
                        <UserBadges badges={record.badges} />
                    </>
            )} />
            <Table.Column title="提交时间" dataIndex="timestamp" render={(text, record)=>(
                text===null ? spanner : <LookingGlassLink uid={record.uid} nickname={record.nickname}>
                    <span style={{fontWeight: 'normal'}}>{format_ts(text)}</span>
                </LookingGlassLink>
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
    let [last_reloaded, do_reload, reload_btn] = useReloadButton(load_data, 3, 180);
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
                <Loading /> :
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