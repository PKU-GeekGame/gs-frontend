import {Button, Input} from 'antd';
import {RightCircleOutlined} from '@ant-design/icons';

import {to_auth} from '../utils';

import './LoginForm.less';

export function LoginForm() {
    return (
        <div className="slim-container">
            <br />

            <div className="login-instruction">
                <p><b>报名须知</b></p>
                <p>
                    TODO: 报名须知
                </p>
                <p>
                    <Button size="large" onClick={()=>to_auth('microsoft/login')}>
                        <RightCircleOutlined /> 报名
                    </Button>
                </p>

                <br />
                <hr />
                <br />

                <p><b>登录</b></p>
                <form action="/service/auth/token" method="get">
                    <p>
                        <Input addonBefore="密码" style={{width: '320px'}} placeholder="（报名后将通过邮件发送给您）" size="large" />
                    </p>
                    <p>
                        <Button size="large" htmlType="submit">
                            <RightCircleOutlined/> 登录
                        </Button>
                    </p>
                </form>
            </div>
        </div>
    );
}