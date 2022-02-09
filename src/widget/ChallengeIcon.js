import {ExpandOutlined, MinusSquareTwoTone, CheckSquareTwoTone, FlagTwoTone, BorderOutlined} from '@ant-design/icons';

import './ChallengeIcon.less';

export function ChallengeIcon({status}) {
    //return <BorderOutlined />;

    if(status==='untouched')
        return <BorderOutlined className="challenge-icon-untouched" />;
    else if(status==='partial')
        return <MinusSquareTwoTone className="challenge-icon-partial" twoToneColor="#1890ff" />;
    else if(status==='passed')
        return <CheckSquareTwoTone className="challenge-icon-passed" twoToneColor="#52c41a" />;
    else
        return '??';
}

export function FlagIcon({status}) {
    if(status==='untouched')
        return <FlagTwoTone className="flag-icon-passed" twoToneColor="#999999" />;
    else if(status==='passed')
        return <FlagTwoTone className="flag-icon-passed" twoToneColor="#52c41a" />;
    else
        return '??';
}