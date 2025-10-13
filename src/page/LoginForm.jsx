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
                <p><b>- 登录 -</b></p>
                <div style={{textAlign: 'left'}}>
                    <TemplateFile name="registration" />
                </div>
                <br />

                <form action="/service/auth/password" method="post">
                    <p>
                        <Input name="email" addonBefore="注册邮箱" required placeholder="" size="large" />
                        <Input name="password" addonBefore="密码" required placeholder="" size="large" />
                    </p>
                    <Button type="primary" size="large" block htmlType="submit">
                        <RightCircleOutlined/> 进入比赛
                    </Button>
                </form>
            </div>
        </div>
    );
}