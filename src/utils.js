import {useRef, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Result, Button, message} from 'antd';
import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {InboxOutlined} from '@ant-design/icons';

import {AUTH_ROOT} from './branding';

export function Cap({text, width}) {
    return (
        <span className="capped-text" style={{
            maxWidth: width+'px',
        }}>{text}</span>
    );
}

export function random_str(len) {
    let alphabet = 'qwertyuiopasdfghjkzxcvbnmQWERTYUPASDFGHJKLZXCVBNM23456789';
    let out = '';
    for(let i=0; i<len; i++)
        out += alphabet.charAt(Math.floor(Math.random()*alphabet.length));
    return out;
}

export function to_auth(endpoint) {
    message.loading({content: '正在前往登录页面…', key: 'Utils.ToAuth', duration: 15});
    setTimeout(()=>{
        window.location.href = AUTH_ROOT+endpoint;
    }, 100);
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
    prefixFromNow: '',
    suffixAgo: (val, delta)=>{
        return delta<59500 ? '刚刚' : '前';
    },
    suffixFromNow: (val, delta)=>{
        return (-delta)<59500 ? '1分钟之内' : '后';
    },
    seconds: '\u200b', // ZWSP, not '' because TimeAgo will fall back to default
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
export function TimestampAgo({ts, delta=0}) {
    return (
        <TimeAgo date={(ts+delta)*1000} formatter={timeago_format} title={format_ts(ts)} />
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
            subTitle={<Cap text={loc.pathname} width={300} />}
            extra={[
                <Button key="home" onClick={()=>nav('/')}>返回主页</Button>
            ]}
        />
    );
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