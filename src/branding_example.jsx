import logo from '../assets/logo-bw.webp';

export const GAME_TITLE = document.title;
export const QQ_GROUP = '1919810';

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