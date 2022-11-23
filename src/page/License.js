import {CONTEST_LICENSE} from '../branding';
import {ExtLink} from '../utils';
import {Card} from 'antd';

export function License() {
    return (
        <div className="slim-container">
            <h1>开源许可证</h1>
            <Card>
                <p><b>关于本平台的使用许可：</b></p>
                <p>
                    Guiding Star 是为了 PKU GeekGame 而开发的 CTF 比赛平台，<ExtLink href="https://github.com/PKU-GeekGame/guiding-star">在 GitHub 开放源代码</ExtLink>。
                </p>
                <p>
                    允许任何人在 MIT 协议（如下）的要求下部署或二次开发本平台。
                </p>
                <p>
                    Copyright (c) 2022 @xmcp, and other members from PKUGGG Team
                </p>
                <p>
                    Permission is hereby granted, free of charge, to any person obtaining a copy
                    of this software and associated documentation files (the "Software"), to deal
                    in the Software without restriction, including without limitation the rights
                    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                    copies of the Software, and to permit persons to whom the Software is
                    furnished to do so, subject to the following conditions:
                </p>
                <p>
                    The above copyright notice and this permission notice shall be included in all
                    copies or substantial portions of the Software.
                </p>
                <p>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                    SOFTWARE.
                </p>
                <p>
                    平台前端部分使用了按照 MIT 协议开源的{' '}
                    <ExtLink href="https://github.com/facebook/react/blob/main/LICENSE">React</ExtLink>、
                    <ExtLink href="https://github.com/remix-run/react-router/blob/main/LICENSE.md">React-Router</ExtLink>、
                    <ExtLink href="https://github.com/nmn/react-timeago/blob/master/LICENSE">React-TimeAgo</ExtLink>、
                    <ExtLink href="https://github.com/ant-design/ant-design/blob/master/LICENSE">Ant-Design</ExtLink>、
                    <ExtLink href="https://github.com/ant-design/ant-design-charts/blob/master/LICENSE">Ant-Design-Charts</ExtLink> 和{' '}
                    <ExtLink href="https://github.com/sudodoki/copy-to-clipboard/blob/master/LICENSE">copy-to-clipboard</ExtLink>{' '}
                    等第三方组件。
                </p>
                <p>
                    平台后端部分使用的第三方组件列表参见后端代码。
                </p>
            </Card>
            <br />
            <Card>
                <p><b>关于比赛内容的使用许可：</b></p>
                {CONTEST_LICENSE}
            </Card>
        </div>
    );
}