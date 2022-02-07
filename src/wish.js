import {WISH_ROOT} from './branding';

const WISH_VER = 'wish.alpha.v1';

export function wish(endpoint, data) {
    return new Promise((resolve)=>{
        fetch(WISH_ROOT+endpoint, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-Wish-Version': WISH_VER,
                'Content-Type': 'application/json',
            },
            body: data===undefined ? '{}' : JSON.stringify(data),
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
                    'error_msg': `请求失败 ${e}`,
                });
            });
    });
}