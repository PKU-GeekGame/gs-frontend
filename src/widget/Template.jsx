import {useState, useEffect, useCallback} from 'react';

import {TEMPLATE_ROOT} from '../branding';
import {Reloader} from '../page/GameLoading';

import './Template.less';
import {Loading} from './Loading';

export function TemplateStr({name, children}) {
    return (
        <div className={`template template-${name}`} dangerouslySetInnerHTML={{__html: children}} />
    );
}

export function TemplateFile({name}) {
    let [error, set_error] = useState(null);
    let [html, set_html] = useState(null);

    let load_template = useCallback(()=>{
        set_html(null);
        set_error(null);

        fetch(TEMPLATE_ROOT+name, {
            method: 'GET',
            credentials: 'include',
        })
            .then((res)=>{
                if(res.status!==200) {
                    set_error(`HTTP 错误 ${res.status}`);
                    return null;
                } else {
                    return res.text();
                }
            })
            .then((html)=>{
                set_html(html);
            })
            .catch((e)=>{
                set_error(`网络错误 ${e}`);
            });
    }, [name]);

    useEffect(()=>{
        load_template();
    }, [load_template]);

    if(error)
        return <Reloader message={error} reload={load_template} />;
    if(html===null)
        return <Loading />;

    return (
        <TemplateStr name={name}>{html}</TemplateStr>
    );
}