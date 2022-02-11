import {Alert, Skeleton, Table, Tooltip, Button, message} from 'antd';
import {HistoryOutlined, SyncOutlined, ThunderboltOutlined} from '@ant-design/icons';

import {Reloader} from './GameLoading';
import {UserGroupTag} from '../widget/UserGroupTag';
import {ChallengeIcon, FlagIcon} from '../widget/ChallengeIcon';
import {useWishData} from '../wish';
import {format_ts, TimestampAgo, useReloadButton} from '../utils';

function ChallengeStatus({ch, record}) {
    return (
        <div>
            <p>{ch.title}</p>
            {ch.flags.map((name, idx)=>{
                let ts = record.flag_pass_ts[`${ch.id}_${idx}`];
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
        <Table
            size="small"
            dataSource={data.list}
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
                <div>
                    {data.challenges.map((ch)=>(
                        <Tooltip key={ch.id} title={<ChallengeStatus ch={ch} record={record} />}>
                            <ChallengeIcon status={record.challenge_status[ch.id]} />
                        </Tooltip>
                    ))}
                </div>
            )} />
        </Table>
    );
}

function FirstBloodBoardContent({data}) {
    let disp_data = data.list.flatMap((ch)=>(
        ch.flags.map((f)=>({
            ...f,

            challenge_title: ch.title,
            flags_count: ch.flags.length,
        }))
    ));

    return (
        <Table
            size="small"
            dataSource={disp_data}
        >
            <Table.Column title="题目" dataIndex="challenge_title" />
            <Table.Column title="Flag" dataIndex="flag_name" render={(text)=>(
                text===null ? '（解出所有 Flag）' : text
            )} />
            <Table.Column title="一血获得者" key="user" render={(_text, record)=>(
                record.nickname===null ?
                    <><ThunderboltOutlined /> 虚位以待</> :
                    <>
                        {record.nickname} {record.group_disp===null ? null : <UserGroupTag>{record.group_disp}</UserGroupTag>}
                    </>
            )} />
            <Table.Column title="提交时间" dataIndex="timestamp" render={(text)=>(
                text===null ? '--' : format_ts(text)
            )} />
        </Table>
    )
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
                    <HistoryOutlined /> <TimestampAgo ts={last_reloaded} />更新（{format_ts(last_reloaded)}）
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
                {data===null ?
                    <Skeleton /> :
                    <BoardContent data={data} />
                }
            </div>
        </div>
    )
}