import {renderToStaticMarkup} from 'react-dom/server';
import {
    MinusSquareTwoTone,
    CheckSquareTwoTone,
    FlagTwoTone,
    BorderOutlined,
    EyeOutlined,
    InfoCircleTwoTone,
} from '@ant-design/icons';
import {Tag} from 'antd';

import './CommonIcon.less';

function parse_status(status) {
    let s = status.split('-');
    if(s.length===2)
        return [s[0], s[1]==='deducted'];
    else
        return [status, false];
}

const memo_challenge_icon = {
    'untouched': renderToStaticMarkup(<BorderOutlined className="challenge-icon-untouched" />, {}),
    'partial': renderToStaticMarkup(<MinusSquareTwoTone className="challenge-icon-partial" twoToneColor="#1e63bd" />, {}),
    'passed': renderToStaticMarkup(<CheckSquareTwoTone className="challenge-icon-passed" twoToneColor="#1ab500" />, {}),
};

const memo_flag_icon = {
    'untouched': renderToStaticMarkup(<FlagTwoTone className="flag-icon-passed" twoToneColor="#a7a7a7" />, {}),
    'passed': renderToStaticMarkup(<FlagTwoTone className="flag-icon-passed" twoToneColor="#1ab500" />, {}),
};

const memo_aux_icon = {
    'glass': renderToStaticMarkup(<EyeOutlined />, {}),
    'info': renderToStaticMarkup(<InfoCircleTwoTone twoToneColor="#ff6600" />, {}),
}

export function ChallengeIcon({status}) {
    let [passed, deduct] = parse_status(status);
    let inner_html = memo_challenge_icon[passed] || '??';

    return <span className={deduct ? 'status-icon-deducted' : ''} dangerouslySetInnerHTML={{__html: inner_html}} />;
}

export function FlagIcon({status}) {
    let [passed, deduct] = parse_status(status);
    let inner_html = memo_flag_icon[passed] || '??';

    return <span className={deduct ? 'status-icon-deducted' : ''} dangerouslySetInnerHTML={{__html: inner_html}} />;
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

export function AuxIcon({type}) {
    let inner_html = memo_aux_icon[type] || '??';
    return <span dangerouslySetInnerHTML={{__html: inner_html}} />;
}