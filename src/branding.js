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
        TODO: 比赛许可证
    </p>
</>);

export const WRITEUP_INSTRUCTION = (<>
    <p>
        TODO: Witeup 提交说明
    </p>
</>);