import {CONTEST_LICENSE} from '../branding';
import {ExtLink} from '../utils';
import {Card} from 'antd';

export function License() {
    return (
        <div className="slim-container">
            <h1>开源许可证</h1>
            <Card>
                <p>
                    Guiding Star 是 PKUGGG Team 开发的 CTF 比赛平台，
                    允许任何人在满足下列协议要求的情况下部署或二次开发本平台。
                </p>
                <p>
                    平台的前端部分按照 <ExtLink href="https://www.gnu.org/licenses/gpl-3.0.en.html">GPLv3</ExtLink> 协议许可。
                    前端部分还使用了按照 MIT 协议开源的{' '}
                    <ExtLink href="https://github.com/facebook/react/blob/main/LICENSE">React</ExtLink>、
                    <ExtLink href="https://github.com/remix-run/react-router/blob/main/LICENSE.md">React-Router</ExtLink>、
                    <ExtLink href="https://github.com/nmn/react-timeago/blob/master/LICENSE">React-TimeAgo</ExtLink>、
                    <ExtLink href="https://github.com/ant-design/ant-design/blob/master/LICENSE">Ant-Design</ExtLink>、
                    <ExtLink href="https://github.com/ant-design/ant-design-charts/blob/master/LICENSE">Ant-Design-Charts</ExtLink> 和{' '}
                    <ExtLink href="https://github.com/sudodoki/copy-to-clipboard/blob/master/LICENSE">copy-to-clipboard</ExtLink>{' '}
                    等第三方组件。
                </p>
                <p>
                    平台的后端部分按照 <ExtLink href="https://www.gnu.org/licenses/agpl-3.0.en.html">AGPLv3</ExtLink> 协议许可。
                    使用的第三方组件列表参见后端代码。
                </p>
            </Card>
            <br />
            <Card>
                {CONTEST_LICENSE}
            </Card>
        </div>
    )
}