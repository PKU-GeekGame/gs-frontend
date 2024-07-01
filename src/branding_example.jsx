export const GAME_TITLE = document.title;
export const GAME_LOGO = <img src="logo-bw.png" alt="" className="game-logo" />;

const SVC_ROOT = '/service/'
export const WISH_ROOT = SVC_ROOT+'wish/';
export const AUTH_ROOT = SVC_ROOT+'auth/';
export const TEMPLATE_ROOT = SVC_ROOT+'template/';
export const WS_ROOT = SVC_ROOT+'ws/';
export const SYBIL_ROOT = SVC_ROOT+'anticheat/';
export const ATTACHMENT_ROOT = SVC_ROOT+'attachment/';

export function WEB_TERMINAL_ADDR(action, token) {
    return `https://${action.host}/?token=${token}`;
}

export const CONTEST_LICENSE = (<>
    <p>
        （比赛内容的授权许可）
    </p>
</>);

export const WRITEUP_INSTRUCTION = (<>
    <p>
        （Writeup 提交说明）
    </p>
</>);

let _anticheat_in_progress = false;
export async function ANTICHEAT_REPORT() {
    if(_anticheat_in_progress)
        return;

    _anticheat_in_progress = true;
    try {
        if(import.meta.VITE_APP_ANTICHEAT_ENABLED!=='false') {
            //console.log('your anticheat logic here');
        }
    } finally {
        _anticheat_in_progress = false;
    }
}