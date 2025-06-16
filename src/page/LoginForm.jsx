import {Button, Input} from 'antd';
import {RightCircleOutlined} from '@ant-design/icons';

import {TemplateFile} from '../widget/Template';

import './LoginForm.less';

const LOGIN_URL = 'https://wj.sjtu.edu.cn/q/eaTKoZWg';

export function LoginForm() {
    return (
        <div className="slim-container">
            <br />

            <div className="login-instruction">
                <p><b>- 报名须知 -</b></p>
                <div style={{textAlign: 'left'}}>
                    <TemplateFile name="registration" />
                </div>
                <br />

                <div>
                    <Button type="primary" size="large" block onClick={()=>{window.location.href=LOGIN_URL;}}>
                        <RightCircleOutlined /> 报名参赛
                    </Button>
                </div>

                <br />
                <br />
                <br />

                <p><b>- 登录 -</b></p>
                <form action="/service/auth/token" method="get">
                    <p>
                        <Input name="token" addonBefore="密码" required placeholder="报名通过后将通过邮件发送给您" size="large" />
                    </p>
                    <Button size="large" block htmlType="submit">
                        <RightCircleOutlined/> 进入比赛
                    </Button>
                </form>
            </div>
        </div>
    );
}