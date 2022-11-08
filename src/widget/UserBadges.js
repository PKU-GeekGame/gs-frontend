import {Tooltip} from 'antd';
import {HeartTwoTone, StarTwoTone, InfoCircleTwoTone} from '@ant-design/icons';

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