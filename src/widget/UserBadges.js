import {Tooltip, Tag} from 'antd';
import {HeartTwoTone, StarTwoTone, InfoCircleTwoTone} from '@ant-design/icons';

import './UserBadges.less';

export function UserBadges({badges}) {
    if(badges.length===0)
        return null;

    let icons = [];
    for(let badge of badges) {
        if(badge==='girl')
            icons.push(<Tooltip key={badge} title="具有女生特别奖资格"><HeartTwoTone
                twoToneColor="#eb2f96" /></Tooltip>);
        else if(badge==='rookie')
            icons.push(<Tooltip key={badge} title="具有新生特别奖资格"><StarTwoTone /></Tooltip>);
        else if(badge.startsWith('remark:'))
            icons.push(<Tooltip key={badge} title={badge.substring(7)}><InfoCircleTwoTone
                twoToneColor="#ff6600" /></Tooltip>);
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
    let idx=name.indexOf(' #');
    if(idx<=0)
        return <span className="name-base-part">{name}</span>;
    else {
        let basename=name.substring(0, idx);
        let tag=name.substring(idx);
        return (<>
            <span className="name-base-part">{basename}</span>
            <span className="name-tag-part">{tag}</span>
        </>);
    }
}

export function UserGroupTag({children}) {
    return (
        <Tag color="blue">{children}</Tag>
    );
}