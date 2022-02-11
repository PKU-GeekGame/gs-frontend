import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

import {AUTH_ROOT} from './branding';
import {useLocation, useNavigate} from 'react-router-dom';
import {Result, Button} from 'antd';
import {InboxOutlined} from '@ant-design/icons';
import {useRef, useEffect} from 'react';

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
        //`${time.getFullYear()}-${pad2(time.getMonth()+1)}-${pad2(time.getDate())}`
        `${pad2(time.getMonth()+1)}-${pad2(time.getDate())}`
        +` ${pad2(time.getHours())}:${pad2(time.getMinutes())}:${pad2(time.getSeconds())}`
    );
}

const timeago_format=buildFormatter({
    prefixAgo: null,
    prefixFromNow: '未来',
    suffixAgo: (val, delta)=>{
        return delta<59500 ? '' : '前';
    },
    suffixFromNow: null,
    seconds: '刚刚',
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
    return (
        <TimeAgo date={ts*1000} formatter={timeago_format} title={format_ts(ts)} />
    );
}

export function NotFound() {
    let loc = useLocation();
    let nav = useNavigate();

    return (
        <Result
            icon={<InboxOutlined />}
            status="error"
            title="页面不存在"
            subTitle={cap(loc.pathname, 25)}
            extra={[
                <Button key="home" onClick={()=>nav('/')}>返回主页</Button>
            ]}
        />
    )
}

export function ExtLink({href, children}) {
    return (
        <a href={href}  target="_blank" rel="noreferrer">{children}</a>
    );
}

export function useReloadButton(interval_s) {
    // xxx: will not trigger re-render if only last_reloaded_ms is changed, because it is a ref
    // this is generally safe because usually other states are changed after reloading

    let last_reloaded_ms = useRef(0);
    let reload_btn = useRef(null);

    useEffect(()=>{
        last_reloaded_ms.current = +new Date();
    }, []);

    function mark_reload() {
        if(reload_btn.current)
            reload_btn.current.disabled = true;

        last_reloaded_ms.current = +new Date();

        setTimeout(()=>{
            if((+new Date())-last_reloaded_ms.current >= interval_s*1000-200)
                if(reload_btn.current)
                    reload_btn.current.disabled = false;
        }, interval_s*1000);
    }

    return [last_reloaded_ms.current/1000, mark_reload, reload_btn];
}