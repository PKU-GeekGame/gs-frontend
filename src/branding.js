import {ExtLink} from './utils';

export const GAME_TITLE = document.title;
export const GAME_LOGO = <img src="logo-bw.png" alt="" className="game-logo" />;

const SVC_ROOT = '/service/'
export const WISH_ROOT = SVC_ROOT+'wish/';
export const AUTH_ROOT = SVC_ROOT+'auth/';
export const TEMPLATE_ROOT = SVC_ROOT+'template/';
export const WS_ROOT = SVC_ROOT+'ws/';

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
        所有题目源码采用 <ExtLink href="https://opensource.org/licenses/MIT">MIT</ExtLink> 协议许可，
        命题人和选手 Writeup 按照作者指定的方式进行许可。
    </p>
    <p>
        组织方对比赛相关的其他数据（包括但不限于排行榜、答题记录、比赛公告、参赛须知、比赛介绍和宣传资料）保留所有权利，不允许未授权使用。
    </p>
</>);

export const WRITEUP_INSTRUCTION = (<>
    <p>
        请在 Writeup 中描述自己是如何解出每道题目的，其最低要求是让命题人相信你确实在比赛期间确实独立完成了题目。
        建议使用 Markdown 格式，但我们也接受 .pdf 或 .pptx 格式。
    </p>
    <p>
        如果有其他附加文件（如解题使用的脚本），请将 Writeup 和所有附加文件打包成 .zip 或 .7z 格式。
        由于我们会将部分优秀选手 Writeup 公开到 GitHub，请注意控制文件大小，不要将题目附件、编译结果、临时文件打包在内。
    </p>
    <p>
        在截止时间前请勿向其他选手公开 Writeup 或交流思路。如果他人的 Writeup 与你雷同，你的奖项可能受到影响。
    </p>
</>);