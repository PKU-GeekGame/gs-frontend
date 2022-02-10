import {ExtLink} from './utils';

export const GAME_TITLE = document.title;
export const GAME_LOGO = <img src="logo-bw.png" alt="" className="game-logo" />;

const SVC_ROOT = '/service/'
export const WISH_ROOT = SVC_ROOT+'wish/';
export const AUTH_ROOT = SVC_ROOT+'auth/';
export const TEMPLATE_ROOT = SVC_ROOT+'template/';

export function WEB_TERMINAL_ADDR(action) {
    return `https://${action.host}/`;
}
export function ATTACHMENT_ADDR(action) {
    return `/media/attachment/${action.filename}`;
}

export const CONTEST_LICENSE = (<>
    <p>
        当比赛完全结束后，
        本比赛的所有题面采用 <ExtLink href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</ExtLink> 协议许可，
        所有题目源码采用 <ExtLink href="https://opensource.org/licenses/BSD-3-Clause">BSD</ExtLink> 协议许可，
        命题人和选手 Writeup 按照作者指定的方式进行许可。
    </p>
    <p>
        组织方对比赛相关的其他数据（包括但不限于排行榜、答题记录、比赛公告、参赛须知、比赛介绍和宣传资料）保留所有权利，不允许未授权使用。
    </p>
</>);