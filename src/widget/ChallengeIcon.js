import {MinusSquareTwoTone, CheckSquareTwoTone, FlagTwoTone, BorderOutlined} from '@ant-design/icons';

import './ChallengeIcon.less';

export function ChallengeIcon({status}) {
    if(status==='untouched')
        return <BorderOutlined className="challenge-icon-untouched" />;
    else if(status==='partial')
        return <MinusSquareTwoTone className="challenge-icon-partial" twoToneColor="#1e63bd" />;
    else if(status==='passed')
        return <CheckSquareTwoTone className="challenge-icon-passed" twoToneColor="#1ab500" />;
    else
        return '??';
}

export function FlagIcon({status}) {
    if(status==='untouched')
        return <FlagTwoTone className="flag-icon-passed" twoToneColor="#a7a7a7" />;
    else if(status==='passed')
        return <FlagTwoTone className="flag-icon-passed" twoToneColor="#1ab500" />;
    else
        return '??';
}