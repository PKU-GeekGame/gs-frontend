import {useState} from 'react';
import {Empty, Skeleton, Card, Tag, Pagination} from 'antd';
import {NotificationOutlined} from '@ant-design/icons';

import {Reloader} from './GameLoading';
import {useWishData} from '../wish';
import {TemplateStr} from '../widget/Template';
import {TimestampAgo} from '../utils';

import './Announcements.less';

const PAGE_SIZE = 10;

export function Announcement({announcement, extra}) {
    return (
        <div className="announcement">
            <Card
                type="inner" size="small" bordered={false} extra={extra||null}
                title={<>
                    <Tag style={{fontSize: '1em', fontWeight: 'bold'}} color="blue">
                    <NotificationOutlined /> {announcement.title}</Tag>
                    {' '}<TimestampAgo ts={announcement.timestamp_s} />发布
                </>}
            >
                <TemplateStr name="announcement">{announcement.content}</TemplateStr>
            </Card>
        </div>
    );
}

export function Announcements() {
    let [error, data, load_data] = useWishData('announcements');
    let [page, set_page] = useState(1);

    if(error)
        return <Reloader message={error.error_msg} reload={load_data} />;
    if(data===null)
        return <Skeleton />;
    if(data.list.length===0)
        return (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无公告" />
        );

    let cur_data = data.list.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

    return (
        <div className="announcement-list">
            <Pagination current={page} onChange={(x)=>set_page(x)} total={data.list.length} pageSize={PAGE_SIZE} />
            {cur_data.map((ann)=>(
                <Announcement key={ann.id} announcement={ann} />
            ))}
            <Pagination current={page} onChange={(x)=>set_page(x)} total={data.list.length} pageSize={PAGE_SIZE} />
        </div>
    );
}