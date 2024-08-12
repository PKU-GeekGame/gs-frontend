import {Timeline, Empty} from 'antd';
import {ClockCircleOutlined} from '@ant-design/icons';

import {useWishData} from '../wish';
import {Reloader} from './GameLoading';
import {format_ts} from '../utils';
import {Loading} from '../widget/Loading';

import './Trigger.less';

function WithStatus({status, children}) {
    return (
        <span className={`trigger-status-${status}`}>{children}</span>
    );
}

function Splitter({children}) {
    let splitted = children.split(';');

    return (
        <div className="trigger-fragments">
            {splitted.map((frag, idx)=>(
                <p key={idx}>{frag}</p>
            ))}
        </div>
    );
}

export function Triggers() {
    let [error, data, load_data] = useWishData('triggers');

    if(error)
        return <Reloader message={error.error_msg} reload={load_data} />;
    if(data===null)
        return <Loading />;

    return (
        <div>
            <br />
            <Timeline
                mode="left"
                items={data.list.map((trigger)=>({
                    color: {'pst': 'gray', 'prs': 'blue', 'ftr': 'black'}[trigger.status],
                    dot: {'pst': null, 'prs': <ClockCircleOutlined />, 'ftr': null}[trigger.status],
                    label: (
                        <WithStatus status={trigger.status}>
                            {trigger.timestamp_s===0 ? '--' : format_ts(trigger.timestamp_s, false)}
                        </WithStatus>
                    ),
                    children: (
                        <WithStatus status={trigger.status}><Splitter>{trigger.name}</Splitter></WithStatus>
                    ),
                }))}
            />
            {data.list.length===0 &&
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无赛程" />
            }
        </div>
    );
}