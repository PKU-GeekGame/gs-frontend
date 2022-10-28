import {useState} from 'react';
import {Modal, Skeleton, Table} from 'antd';

import {useWishData} from '../wish';
import {Reloader} from '../page/GameLoading';
import {UserGroupTag} from './UserGroupTag';
import {format_ts} from '../utils';

import './TouchedUsers.less';

function TouchedUsersModal({ch}) {
    let [error, data, load_data] = useWishData('get_touched_users/'+ch.key);

    if(error)
        return <Reloader message={error.error_msg} reload={load_data} />;
    if(data===null)
        return <Skeleton />;

    return (
        <div>
            <Table dataSource={data.list} size="small">
                <Table.Column
                    title="用户"
                    key="user"
                    render={(_text, record)=>(
                    <>
                        {record.nickname}{' '}
                        <UserGroupTag>{record.group_disp}</UserGroupTag>
                    </>
                    )}
                    filters={[
                        {text: '北京大学选手', value: 'pku'},
                        {text: '其他选手', value: 'other'},
                    ]}
                    onFilter={(value, record)=>(
                        value==='pku'? record.group_disp==='北京大学' :
                        value==='other'? record.group_disp!=='北京大学' :
                                true
                    )}
                    filterMultiple={false}
                />
                {ch.flags.map((flag, idx)=>(
                    <Table.Column key={idx} title={flag.name || '通过时间'} dataIndex={['flags', idx]} render={(text)=>(
                        text ? format_ts(text) : ''
                    )} />
                ))}
            </Table>
        </div>
    );
}

export function TouchedUsersLink({ch, children}) {
    /* eslint-disable jsx-a11y/anchor-is-valid */

    let [modal_open, set_modal_open] = useState(false);

    return (
        <>
            <a onClick={()=>set_modal_open(true)}>{children}</a>

            <Modal
                visible={modal_open}
                title={`${ch.title} 的通过情况`}
                footer={null}
                destroyOnClose={true}
                onCancel={()=>set_modal_open(false)}
                width={600}
                className="touched-users-modal"
            >
                <TouchedUsersModal ch={ch} />
            </Modal>
        </>
    );
}