import {ExtLink} from './utils';

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
        比赛完全结束后，资料存档将 <ExtLink href="https://github.com/PKU-GeekGame/geekgame-2nd">公开到 GitHub</ExtLink>。
        本比赛的所有题面采用 <ExtLink href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</ExtLink> 协议许可，
        所有题目源码采用 <ExtLink href="https://opensource.org/licenses/MIT">MIT</ExtLink> 协议许可，
        命题人和选手 Writeup 按照作者指定的方式进行许可。
    </p>
    <p>
        请注意上述许可不包括比赛相关的其他资料（包括但不限于比赛公告、参赛须知、比赛介绍和其他宣传资料）。这些资料不允许未授权使用。
    </p>
</>);

export const WRITEUP_INSTRUCTION = (<>
    <p>
        请在 Writeup 中描述自己是如何解出每道题目的，其最低要求是让命题人相信你确实在比赛期间独立完成了题目。
        建议使用 Markdown 格式，但我们也接受 .pdf 或 .pptx 格式。
    </p>
    <p>
        如果有附加文件（如解题使用的脚本），请将 Writeup 和所有附加文件打包成 .7z 或 .zip 格式。
        我们会将部分优秀选手 Writeup 公开到 GitHub，因此请注意控制文件大小，避免将题目附件、编译结果、临时文件、第三方程序打包在内。
    </p>
    <p>
        在提交截止时间前请勿公开 Writeup 或交流思路。如果他人的 Writeup 与你雷同，你也会受到影响。
    </p>
</>);