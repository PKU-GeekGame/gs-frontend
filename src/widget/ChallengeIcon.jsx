import {MinusSquareTwoTone, CheckSquareTwoTone, FlagTwoTone, BorderOutlined} from '@ant-design/icons';
import {Tag} from 'antd';

import './ChallengeIcon.less';

function parse_status(status) {
    let s = status.split('-');
    if(s.length===2)
        return [s[0], s[1]==='deducted'];
    else
        return [status, false];
}

export function ChallengeIcon({status}) {
    let [passed, deduct] = parse_status(status);

    let icon;
    if(passed==='untouched')
        icon = <BorderOutlined className="challenge-icon-untouched" />;
    else if(passed==='partial')
        icon = <MinusSquareTwoTone className="challenge-icon-partial" twoToneColor="#1e63bd" />;
    else if(passed==='passed')
        icon = <CheckSquareTwoTone className="challenge-icon-passed" twoToneColor="#1ab500" />;
    else
        icon = '??';

    return deduct ? <span className="status-icon-deducted">{icon}</span> : icon;
}

export function FlagIcon({status}) {
    let [passed, deduct] = parse_status(status);

    let icon;
    if(passed==='untouched')
        icon = <FlagTwoTone className="flag-icon-passed" twoToneColor="#a7a7a7" />;
    else if(passed==='passed')
        icon = <FlagTwoTone className="flag-icon-passed" twoToneColor="#1ab500" />;
    else
        icon = '??';

    return deduct ? <span className="status-icon-deducted">{icon}</span> : icon;
}

export function CategoryBadge({color, children}) {
    if(children===null)
        return null;

    return (
        <span className="category-badge">
            <Tag color={color}>{children}</Tag>
        </span>
    );
}