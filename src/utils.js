import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

import {AUTH_ROOT} from './branding';

export function cap(s, n) {
    if(2*s.length<=n)
        return <span>{s}</span>;

    // check for full-width chars
    let out = '';
    let curlen = 0;
    let capped = false;
    for(let i=0; i<s.length; i++) {
        curlen += s.charCodeAt(i)>=128 ? 2 : 1;
        if(curlen>n) {
            capped = true;
            break;
        }
        out += s.charAt(i);
    }

    if(capped)
        return <span title={s}>{out+'…'}</span>;
    else
        return <span>{s}</span>;
}

export function to_auth(endpoint) {
    window.location.href = AUTH_ROOT+endpoint;
}

function pad2(x) {
    return x<10 ? '0'+x : ''+x;
}
export function format_ts(ts) {
    let time = new Date(ts*1000);
    return (
        `${time.getFullYear()}-${pad2(time.getMonth()+1)}-${pad2(time.getDate())}`
        +` ${pad2(time.getHours())}:${pad2(time.getMinutes())}:${pad2(time.getSeconds())}`
    );
}

const timeago_format=buildFormatter({
    prefixAgo: null,
    prefixFromNow: '未来',
    suffixAgo: '前',
    suffixFromNow: null,
    seconds: '0分钟',
    minute: '1分钟',
    minutes: '%d分钟',
    hour: '1小时',
    hours: '%d小时',
    day: '1天',
    days: '%d天',
    month: '1个月',
    months: '%d月',
    year: '1年',
    years: '%d年',
    wordSeparator: '',
});
export function TimestampAgo({ts}) {
    let time = new Date(ts*1000);
    return (
        <TimeAgo date={time} formatter={timeago_format} title={format_ts(ts)} />
    );
}