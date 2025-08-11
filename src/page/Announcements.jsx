import {useState, useEffect} from 'react';
import {Empty, Card, Tag, Pagination} from 'antd';
import {NotificationOutlined} from '@ant-design/icons';
import {Loading} from '../widget/Loading';

import {Reloader} from './GameLoading';
import {useWishData} from '../wish';
import {TemplateStr} from '../widget/Template';
import {TimestampAgo} from '../utils';
import {useFrontendConfig} from '../logic/FrontendConfig';

import './Announcements.less';

const PAGE_SIZE = 10;

export function Announcement({announcement, extra, hide}) {
    return (
        <div className="announcement">
            <Card
                type="inner" size="small" variant="borderless" extra={extra||null}
                title={<>
                    <Tag style={{fontSize: '1em', fontWeight: 'bold'}} color="#555">
                    <NotificationOutlined /> {announcement.title}</Tag>
                    {' '}<TimestampAgo ts={announcement.timestamp_s} />发布
                </>}
                className={hide ? 'announcement-hide' : ''}
            >
                <TemplateStr name="announcement">{announcement.content}</TemplateStr>
            </Card>
        </div>
    );
}

export function Announcements() {
    let {set_config} = useFrontendConfig();
    let [error, data, load_data] = useWishData('announcements');
    let [page, set_page] = useState(1);

    useEffect(()=>{
        window.scroll(0, 0);
    }, [page]);

    useEffect(() => {
        if(data && data.list.length>0) // mark last announcement as read
            set_config({read_announcement_id: data.list[0].timestamp_s});
    }, [data]);

    if(error)
        return <Reloader message={error.error_msg} reload={load_data} />;
    if(data===null)
        return <Loading />;
    if(data.list.length===0)
        return (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无公告" />
        );

    let cur_data = data.list.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

    return (
        <div className="announcement-list">
            {cur_data.map((ann)=>(
                <Announcement key={ann.id} announcement={ann} hide={false} />
            ))}
            <Pagination align="center" current={page} onChange={(x)=>set_page(x)} total={data.list.length} pageSize={PAGE_SIZE} />
        </div>
    );
}