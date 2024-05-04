export const GAME_TITLE = document.title;

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

export const WRITEUP_INSTRUCTION = (<>
    <p>
        请在 Writeup 中描述本队伍是如何解出每道题目的，应当包含详细的解题过程、思路和相关代码等。Writeup 将被用来辅助甄别作弊情况，未及时提交将视为放弃获奖资格。
        请使用 Markdown、Word、PDF 等常见格式书写 Writeup。
    </p>
    <p>
        如果有附加文件（如截图和代码），请将 Writeup 和所有附加文件打包成 .7z 或 .zip 格式。
        上传大小限制是 50MB，因此请避免将题目附件、编译结果、临时文件、第三方程序打包在内。
    </p>
    <p>
        在提交截止时间前请勿公开 Writeup 或交流思路。如果他人的 Writeup 与你雷同，你也会受到影响。
    </p>
</>);
