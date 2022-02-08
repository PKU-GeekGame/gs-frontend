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