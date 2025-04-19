import {Tooltip, Tag} from 'antd';
import {StarTwoTone, InfoCircleTwoTone, LikeTwoTone} from '@ant-design/icons';

import './UserBadges.less';

export function UserBadges({badges}) {
    if(badges.length===0)
        return null;

    let icons = [];
    for(let badge of badges) {
        if(badge.startsWith('remark:'))
            icons.push(<Tooltip key={badge} title={badge.substring(7)}><InfoCircleTwoTone twoToneColor="#ff6600" /></Tooltip>);
        else
            icons.push(<span key={badge}>[{badge}]</span>)
    }

    return (
        <span className="user-badges">
            {icons}
        </span>
    );
}

export function UserName({name}) {
    return <span className="name-base-part">{name}</span>;
}

export function UserGroupTag({children}) {
    return (
        <Tag color="blue" className="user-group-tag">{children}</Tag>
    );
}