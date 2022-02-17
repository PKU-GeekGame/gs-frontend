import {lazy, Suspense} from 'react';
import {Alert, Skeleton, Table, Tooltip, Button, message} from 'antd';
import {HistoryOutlined, SyncOutlined} from '@ant-design/icons';

import {Reloader} from './GameLoading';
import {UserGroupTag} from '../widget/UserGroupTag';
import {ChallengeIcon, FlagIcon} from '../widget/ChallengeIcon';
import {useWishData} from '../wish';
import {format_ts, TimestampAgo, useReloadButton} from '../utils';

import './Board.less';

const TopStarPlot = lazy(()=>import('../widget/TopStarPlot'));

function ChallengeStatus({ch, record}) {
    return (
        <div>
            <p>{ch.title} ({ch.category})</p>
            {ch.flags.map((name, idx)=>{
                let ts = record.flag_pass_ts[`${ch.id}_${idx}`] || null;
                return (
                    <p key={idx}>
                        <FlagIcon status={ts===null ? 'untouched' : 'passed'} />{' '}
                        {name}：
                        {ts===null ? '尚未通过' : format_ts(ts)}
                    </p>
                );
            })}
        </div>
    );
}

function ScoreBoardContent({data}) {
    return (
        <div>
            <Alert.ErrorBoundary>
                <Suspense fallback={<Skeleton />}>
                    <TopStarPlot data={data} />
                </Suspense>
            </Alert.ErrorBoundary>
            <Table
                size="small"
                dataSource={data.list}
                pagination={false}
                rowKey="rank"
            >
                <Table.Column title="#" dataIndex="rank" />
                <Table.Column title="昵称" key="name" render={(_text, record)=>(<>
                    {record.nickname} {record.group_disp===null ? null : <UserGroupTag>{record.group_disp}</UserGroupTag>}
                </>)} />
                <Table.Column title="总分" dataIndex="score" />
                <Table.Column title="最后提交时间" dataIndex="last_succ_submission_ts" render={(text)=>(
                    format_ts(text)
                )} />
                <Table.Column title="答题进度" key="challenges" render={(_text, record)=>(
                    data.challenges.map((ch)=>(
                        <Tooltip
                            key={ch.id} trigger="hover" destroyTooltipOnHide={true}
                            title={<ChallengeStatus ch={ch} record={record} />}
                            placement="topRight" align={{offset: [10, 8]}}
                            mouseEnterDelay={0} mouseLeaveDelay={0}
                            overlayClassName="board-challenge-status-tooltip" autoAdjustOverflow={false}
                        >
                            <div className="board-challenge-status-icon">
                                <ChallengeIcon status={record.challenge_status[ch.id]} />
                            </div>
                        </Tooltip>
                    ))
                )} />
            </Table>
        </div>
    );
}

function FirstBloodBoardContent({data}) {
    let disp_data = data.list.flatMap((ch)=>(
        ch.flags.map((f, idx)=>({
            ...f,

            challenge_title: ch.title,
            flags_count: ch.flags.length,
            flag_idx0: idx,
            key: `${ch.id}_${idx}`
        }))
    ));

    return (
        <Table
            size="small"
            dataSource={disp_data}
            pagination={false}
            rowKey="key"
        >
            <Table.Column title="题目" dataIndex="challenge_title" onCell={(record)=>({
                rowSpan: record.flag_idx0===0 ? record.flags_count : 0,
            })} />
            <Table.Column title="Flag" dataIndex="flag_name" render={(text, record)=>(
                (text===null && record.flags_count>1) ? '解出所有 Flag' : text
            )} />
            <Table.Column title="一血获得者" key="user" render={(_text, record)=>(
                record.nickname!==null &&
                    <>
                        {record.nickname} {record.group_disp===null ? null : <UserGroupTag>{record.group_disp}</UserGroupTag>}
                    </>
            )} />
            <Table.Column title="提交时间" dataIndex="timestamp" render={(text)=>(
                text===null ? null : format_ts(text)
            )} />
        </Table>
    );
}

function BoardContent({data}) {
    if(data.type==='score')
        return <ScoreBoardContent data={data} />;
    else if(data.type==='firstblood')
        return <FirstBloodBoardContent data={data} />;
    else
        return <Alert type="error" message={`未知排行榜类型 ${data.type}`} showIcon />;
}

export function Board({name}) {
    let [error, data, load_data] = useWishData('board/'+name);
    let [last_reloaded, mark_reload, reload_btn] = useReloadButton(3);

    if(error)
        return (
            <Reloader message={error.error_msg} reload={()=>{
                mark_reload();
                load_data();
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
                        mark_reload();
                        load_data();
                    }}>
                        <SyncOutlined /> 刷新排行榜
                    </Button>
                </div>
            </div>
            {data===null ?
                <Skeleton /> :
                <BoardContent data={data} />
            }
        </div>
    );
}