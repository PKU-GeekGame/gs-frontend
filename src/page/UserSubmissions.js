import {Skeleton, Table, Tag} from 'antd';

import {Reloader} from './GameLoading';
import {FlagIcon} from '../widget/ChallengeIcon';
import {useWishData} from '../wish';
import {format_ts} from '../utils';

function SubmissionsTable() {
    let [error, data, load_data] = useWishData('submissions');

    if(error)
        return <Reloader message={error.error_msg} reload={load_data} />;
    if(data===null)
        return <Skeleton />;

    return (
        <Table
            size="small"
            dataSource={data.list}
            rowKey="idx"
            scroll={{
                x: 'max-content',
            }}
        >
            <Table.Column title="提交时间" dataIndex="timestamp_s" render={(text)=>format_ts(text)} />
            <Table.Column title="题目" dataIndex="challenge_title" />
            <Table.Column title="Flag" dataIndex="matched_flag" render={(text)=>
                text===null ?
                    <><FlagIcon status="untouched" /> 未匹配</> :
                    <><FlagIcon status="passed" /> 成功匹配 {text}</>
            } />
            <Table.Column title="备注" dataIndex="overrides" render={(overrides)=>
                overrides.map((override, idx)=>(
                    <Tag key={idx} color="red">{override}</Tag>
                ))
            } />
            <Table.Column title="获得分数" dataIndex="gained_score" />
        </Table>
    );
}

export function UserSubmissions() {
    return (
        <div className="slim-container">
            <h1>提交历史记录</h1>
            <SubmissionsTable />
        </div>
    );
}