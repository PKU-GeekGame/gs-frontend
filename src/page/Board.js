import {lazy, Suspense} from 'react';
import {Alert, Skeleton, Table, Tooltip, Button, message, Tag} from 'antd';
import {HistoryOutlined, SyncOutlined, LoadingOutlined, FireOutlined} from '@ant-design/icons';

import {Reloader} from './GameLoading';
import {UserGroupTag} from '../widget/UserGroupTag';
import {ChallengeIcon, FlagIcon} from '../widget/ChallengeIcon';
import {useWishData} from '../wish';
import {format_ts, TimestampAgo, useReloadButton} from '../utils';

import './Board.less';
import {UserBadges} from '../widget/UserBadges';

const TopStarPlot = lazy(()=>import('../widget/TopStarPlot'));

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
                        {flg===null ? '尚未通过' : `(+${flg.gained_score}) ${format_ts(flg.timestamp_s)}`}
                    </p>
                );
            })}
        </div>
    );
}

function TopStarPlotLoading() {
    return (
        <div className="topstar-plot-loading">
            <p><LoadingOutlined /> 加载图表组件</p>
        </div>
    )
}

function UserName({name}) {
    let idx = name.indexOf(' #');
    if(idx<=0)
        return <span className="name-base-part">{name}</span>;
    else {
        let basename = name.substring(0, idx);
        let tag = name.substring(idx);
        return (<>
            <span className="name-base-part">{basename}</span>
            <span className="name-tag-part">{tag}</span>
        </>);
    }
}

function ScoreBoardContent({data}) {
    return (
        <div>
            <Alert.ErrorBoundary>
                <Suspense fallback={<TopStarPlotLoading />}>
                    <TopStarPlot data={data} />
                </Suspense>
            </Alert.ErrorBoundary>
            <br />
            <Table
                size="small"
                dataSource={data.list}
                pagination={false}
                rowKey="rank"
                scroll={{
                    x: 'max-content',
                }}
            >
                <Table.Column title="#" dataIndex="rank" />
                <Table.Column title="昵称" key="name" render={(_text, record)=>(<>
                    <UserName name={record.nickname} />
                    {record.group_disp===null ? null : <>&nbsp;&nbsp;<UserGroupTag>{record.group_disp}</UserGroupTag></>}
                    <UserBadges badges={record.badges} />
                </>)} />
                <Table.Column title="总分" dataIndex="score" render={(text)=><b>{text}</b>} />
                <Table.Column title="最后提交时间" dataIndex="last_succ_submission_ts" render={(text)=>(
                    format_ts(text)
                )} />
                <Table.Column title="答题进度" key="challenges" render={(_text, record)=>(
                    data.challenges.map((ch)=>(
                        <Tooltip
                            key={ch.key} trigger="hover" destroyTooltipOnHide={true}
                            title={<ChallengeStatus ch={ch} record={record} />}
                            placement="topRight" align={{offset: [10, 8]}}
                            mouseEnterDelay={0} mouseLeaveDelay={0}
                            overlayClassName="board-challenge-status-tooltip" autoAdjustOverflow={false}
                        >
                            <div className="board-challenge-status-icon">
                                <ChallengeIcon status={record.challenge_status[ch.key]} />
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
        >
            <Table.Column title="题目" dataIndex="challenge_title" render={(text)=><b>{text}</b>} onCell={(record)=>({
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
                <div>
                    {!!data.desc && <>
                        <Alert type="info" message={data.desc} showIcon />
                        <br />
                    </>}
                    <BoardContent data={data} />
                </div>
            }
        </div>
    );
}