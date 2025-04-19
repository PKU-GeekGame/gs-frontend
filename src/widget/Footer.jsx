import {GithubOutlined} from '@ant-design/icons';

import {useGameInfo} from '../logic/GameInfo';
import {TimeAgo} from '../utils';

import './Footer.less';

export function Footer() {
    let info = useGameInfo();
    let diag_ts = info ? info.diag_ts : 0;

    return (
        <div className="footer">
            {Math.abs(diag_ts)>120000 && <>
                <p className="footer-warning">
                    你的本地时间在服务器时间的
                    <TimeAgo date={diag_ts} live={false} now={()=>0} title={`${Math.round(diag_ts/1000)} 秒`} />
                </p>
                <p className="footer-warning">
                    时间显示可能不准确，请核对后刷新页面
                </p>
            </>}
            <p>
                Project <b>Guiding Star</b> by PKUGGG Team
                {import.meta.env.VITE_APP_BUILD_INFO ? ' ('+import.meta.env.VITE_APP_BUILD_INFO+')' : null}
                {import.meta.env.VITE_APP_MOCK_API_ENV ? ' (Mock: '+import.meta.env.VITE_APP_MOCK_API_ENV+')' : null}
            </p>
            <p>
                <a href="#/license"><GithubOutlined /> 开放源代码</a>
            </p>
        </div>
    );
}