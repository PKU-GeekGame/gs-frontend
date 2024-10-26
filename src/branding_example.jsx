import logo from '../assets/logo-bw.webp';

export const GAME_TITLE = document.title;
export const QQ_GROUP = '【群号】';

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

export const BANNED_MSG = '由于违反规则，此账号的参赛资格已被取消。如有疑问请联系工作人员。';

let _anticheat_in_progress = false;
export async function ANTICHEAT_REPORT() {
    if(_anticheat_in_progress)
        return;

    _anticheat_in_progress = true;
    try {
        if(import.meta.env.VITE_APP_ANTICHEAT_ENABLED!=='false') {
            //console.log('your anticheat logic here');
        }
    } finally {
        _anticheat_in_progress = false;
    }
}

export function Logo({cur_url}) {
    return (
        <img src={logo} alt="" className="game-logo" />
    );
}