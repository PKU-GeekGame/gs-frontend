import {Empty, Skeleton, Card, Tag} from 'antd';
import {NotificationOutlined} from '@ant-design/icons';

import {Reloader} from './GameLoading';
import {useWishData} from '../wish';
import {TemplateStr} from '../widget/Template';
import {TimestampAgo} from '../utils';

import './Announcements.less';

export function Announcement({announcement, extra}) {
    return (
        <div className="announcement">
            <Card
                type="inner" size="small" bordered={false} extra={extra||null}
                title={<>
                    <Tag style={{fontSize: '1em', fontWeight: 'bold'}} color="blue">
                    <NotificationOutlined /> {announcement.title}</Tag>
                    {' '}发布于 <TimestampAgo ts={announcement.timestamp_s} />
                </>}
            >
                <TemplateStr name="announcement">{announcement.content}</TemplateStr>
            </Card>
        </div>
    );
}

export function Announcements() {
    let [error, data, load_data] = useWishData('announcements');

    if(error)
        return <Reloader message={error.error_msg} reload={load_data} />;
    if(data===null)
        return <Skeleton />;

    return (
        <div className="announcement-list">
            {data.list.map((ann)=>(
                <Announcement key={ann.id} announcement={ann} />
            ))}
            {data.list.length===0 &&
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无公告" />
            }
        </div>
    );
}