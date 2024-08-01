import {useState} from 'react';
import {Modal} from 'antd';
import {SubmissionsTable} from '../page/UserSubmissions';
import {AuxIcon} from './CommonIcon';

import './LookingGlassLink.less';

export function LookingGlassLink({children, nickname, uid}) {
    /* eslint-disable jsx-a11y/anchor-is-valid */

    let [state, set_state] = useState(0);

    let linked_children = (
        <a className="looking-glass-link" onClick={()=>set_state(1)}>
            {children}{' '}<AuxIcon type="glass" />
        </a>
    );

    if(state===0)
        return linked_children;

    return (<>
        {linked_children}
        <Modal
            title={`${nickname}（#${uid}）的得分记录`}
            open={state===1} onCancel={()=>set_state(2)}
            footer={null}
            destroyOnClose={true}
            width={700}
        >
            <SubmissionsTable others_uid={uid} />
        </Modal>
    </>);
}