import {useRef, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Result, Button} from 'antd';
import RealTimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {InboxOutlined, CaretDownOutlined} from '@ant-design/icons';

import {AUTH_ROOT} from './branding';
import {useGameInfo} from './logic/GameInfo';

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

export function to_auth(endpoint, message) {
    message.loading({content: '正在前往登录页面…', key: 'Utils.ToAuth', duration: 15});
    setTimeout(()=>{
        window.location.href = AUTH_ROOT+endpoint;
    }, 100);
}

function pad2(x) {
    return x<10 ? '0'+x : x;
}
export function format_ts(ts, seconds=true) {
    let time = (ts instanceof Date) ? ts : new Date(ts*1000);
    if(seconds)
        return `${pad2(time.getMonth()+1)}-${pad2(time.getDate())} ${pad2(time.getHours())}:${pad2(time.getMinutes())}:${pad2(time.getSeconds())}`;
    else
        return `${pad2(time.getMonth()+1)}-${pad2(time.getDate())} ${pad2(time.getHours())}:${pad2(time.getMinutes())}`;
}

const timeago_format = buildFormatter({
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
    months: '%d个月',
    year: '1年',
    years: '%d年',
    wordSeparator: '',
});
export function TimeAgo(props) {
    return (
        <RealTimeAgo {...props} formatter={timeago_format} />
    );
}
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

export function ExtLink({children, ...attrs}) {
    return (
        <a {...attrs} target="_blank" rel="noopener noreferrer">{children}</a>
    );
}

export function useReloadButton(reload_fn, disable_s, expire_s) {
    // xxx: will not trigger re-render if only last_reloaded_ms is changed, because it is a ref
    // this is generally safe because usually other states are changed after reloading

    let info = useGameInfo();

    let last_reloaded_ms = useRef(0);
    let reload_btn = useRef(null);

    useEffect(()=>{
        last_reloaded_ms.current = +new Date();
    }, []);

    useEffect(()=>{
        function on_focus() {
            if(info.feature.submit_flag) // only auto-reload when submit_flag is enabled
                if((+new Date())-last_reloaded_ms.current > expire_s*1000)
                    do_reload();
        }

        window.addEventListener('focus', on_focus);
        return ()=>{
            window.removeEventListener('focus', on_focus);
        };
    });

    function do_reload(clear_data=false) {
        if(reload_btn.current)
            reload_btn.current.disabled = true;

        last_reloaded_ms.current = +new Date();

        setTimeout(()=>{
            if((+new Date())-last_reloaded_ms.current >= disable_s*1000-200)
                if(reload_btn.current)
                    reload_btn.current.disabled = false;
        }, disable_s*1000);

        reload_fn(clear_data);
    }

    return [last_reloaded_ms.current/1000, do_reload, reload_btn];
}

export function WithCaret({children}) {
    return (<>
        {children}
        <span className="nav-caret"><CaretDownOutlined/></span>
    </>);
}