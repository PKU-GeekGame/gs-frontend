import {memo} from 'react';
import {
    MinusSquareTwoTone,
    CheckSquareTwoTone,
    FlagTwoTone,
    BorderOutlined,
    MinusSquareOutlined, CheckSquareOutlined, FlagOutlined,
} from '@ant-design/icons';
import {Tag} from 'antd';

import {useFrontendConfig} from '../logic/FrontendConfig';

import './ChallengeIcon.less';

function parse_status(status) {
    let s = status.split('-');
    if(s.length===2)
        return [s[0], s[1]==='deducted'];
    else
        return [status, false];
}

export const ChallengeIcon = memo(function ChallengeIcon({status}) {
    let {theme} = useFrontendConfig();
    let [passed, deduct] = parse_status(status);

    let icon;
    if(passed==='untouched')
        icon = <BorderOutlined className="challenge-icon-untouched" />;
    else if(passed==='partial')
        icon = theme==='dark' ?
            <MinusSquareOutlined className="status-icon-dark challenge-icon-partial" />:
            <MinusSquareTwoTone className="challenge-icon-partial" twoToneColor="#1e63bd" />;
    else if(passed==='passed')
        icon = theme==='dark' ?
            <CheckSquareOutlined className="status-icon-dark challenge-icon-passed" /> :
            <CheckSquareTwoTone className="challenge-icon-passed" twoToneColor="#1ab500" />;
    else
        icon = '??';

    return deduct ? <span className="status-icon-deducted">{icon}</span> : icon;
});

export const FlagIcon = memo(function FlagIcon({status}) {
    let {theme} = useFrontendConfig();
    let [passed, deduct] = parse_status(status);

    let icon;
    if(passed==='untouched')
        icon = theme==='dark' ?
            <FlagOutlined className="status-icon-dark flag-icon-untouched" /> :
            <FlagTwoTone className="flag-icon-untouched" twoToneColor="#a7a7a7" />;
    else if(passed==='passed')
        icon = theme==='dark' ?
            <FlagOutlined className="status-icon-dark flag-icon-passed" /> :
            <FlagTwoTone className="flag-icon-passed" twoToneColor="#1ab500" />;
    else
        icon = '??';

    return deduct ? <span className="status-icon-deducted">{icon}</span> : icon;
});

export function CategoryBadge({color, children}) {
    if(children===null)
        return null;

    return (
        <span className="category-badge">
            <Tag color={color}>{children}</Tag>
        </span>
    );
}

export function ChallengeKey({color, children}) {
    return (
        <span style={{color: color}} className="challenge-key">{children}</span>
    )
}