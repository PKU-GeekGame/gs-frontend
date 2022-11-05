import {useState, useCallback, useEffect} from 'react';

import {WISH_ROOT} from './branding';
import {random_str} from './utils';

export const WISH_VER = 'wish.2022.v1';

export const TABID = random_str(4);
window._TABID = TABID;

export function wish(endpoint, data) {
    return new Promise((resolve)=>{
        fetch(WISH_ROOT + endpoint + (endpoint.includes('?') ? '&' : '?') + 'tabid=' + TABID, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-Wish-Version': WISH_VER,
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : '{}',
        })
            .then((res)=>{
                if(res.status!==200)
                    return {
                        'error': 'HTTP_ERROR',
                        'error_msg': `HTTP 错误 ${res.status}`,
                    };
                else
                    return res.json();
            })
            .then((json)=>{
                resolve(json);
            })
            .catch((e)=>{
                resolve({
                    'error': 'HTTP_REQ_FAILED',
                    'error_msg': `网络错误 ${e}`,
                });
            });
    });
}

export function useWishData(endpoint, args) {
    let [error, set_error] = useState(null);
    let [data, set_data] = useState(null);

    let load_data = useCallback(()=>{
        set_data(null);
        set_error(null);

        wish(endpoint, args)
            .then((res)=>{
                if(res.error)
                    set_error(res);
                else {
                    set_error(null);
                    set_data(res);
                }
            });
    }, [endpoint, args]);

    useEffect(()=>{
        load_data();
    }, [load_data]);

    return [error, data, load_data];
}
