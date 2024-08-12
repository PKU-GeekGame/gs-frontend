import {Tag} from 'antd';

import {Reloader} from './GameLoading';
import {FlagIcon, CategoryBadge} from '../widget/ChallengeIcon';
import {useWishData} from '../wish';
import {format_ts} from '../utils';
import {TopStarPlotLoader} from '../widget/TopStarPlotLoader';
import {TableLoader as Table} from '../widget/TableLoader';
import {Loading} from '../widget/Loading';

export function SubmissionsTable({others_uid}) {
    let [error, data, load_data] = useWishData(others_uid!==null ? ('submissions/'+others_uid) : 'my_submissions');

    if(error)
        return <Reloader message={error.error_msg} reload={load_data} />;
    if(data===null)
        return <Loading />;

    return (<>
        <TopStarPlotLoader plotkey={null} data={data} single={true} />
        <br />
        <Table
            size="small"
            dataSource={data.list}
            rowKey="idx"
            scroll={{
                x: 'max-content',
            }}
        >
            <Table.Column title="提交时间" dataIndex="timestamp_s" render={(text)=>format_ts(text)} />
            <Table.Column title="题目" key="challenge_title" render={(_text, record)=>(<>
                <CategoryBadge color={record.category_color}>{record.category}</CategoryBadge>
                {record.challenge_title}
            </>)} />
            <Table.Column title="Flag" dataIndex="matched_flag" render={(text)=>
                text===null ?
                    <><FlagIcon status="untouched" /> 不正确</> :
                    <><FlagIcon status="passed" /> {text || 'Flag'}</>
            } />
            {others_uid===null &&
                <Table.Column title="备注" dataIndex="overrides" render={(overrides)=>
                    overrides.map((override, idx)=>(
                        <Tag key={idx} color="red">{override}</Tag>
                    ))
                } />
            }
            <Table.Column title="得分" dataIndex="gained_score" />
        </Table>
    </>);
}

export function UserSubmissions() {
    return (
        <div className="slim-container">
            <h1>提交历史记录</h1>
            <SubmissionsTable others_uid={null} />
        </div>
    );
}