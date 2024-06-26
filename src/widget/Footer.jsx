import {GithubOutlined} from '@ant-design/icons';

import './Footer.less';

export function Footer() {
    return (
        <div className="footer">
            <p>
                Project <b>Guiding Star</b> by PKUGGG Team
                {import.meta.env.VITE_APP_BUILD_INFO ? ' ('+import.meta.env.VITE_APP_BUILD_INFO+')' : null}
                <br />
                <a href="#/license"><GithubOutlined /> 开放源代码</a>
            </p>
        </div>
    );
}