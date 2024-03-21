import {Button, Input} from 'antd';
import {RightCircleOutlined} from '@ant-design/icons';

import './LoginForm.less';

export function LoginForm() {
    return (
        <div className="slim-container">
            <br />

            <div className="login-instruction">
                <p><b>报名须知</b></p>
                <div style={{textAlign: 'left', whiteSpace: 'pre-wrap'}}>
                    TODO: 报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。
                    报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。报名须知。
                </div>
                <p>
                    <Button type="primary" size="large" onClick={()=>window.open('https://example.com/TODO')}>
                        <RightCircleOutlined /> 报名比赛
                    </Button>
                </p>

                <br />
                <hr />
                <br />

                <p><b>登录</b></p>
                <form action="/service/auth/token" method="get">
                    <p>
                        <Input name="token" addonBefore="密码" style={{width: '350px'}} placeholder="报名通过后将通过邮件发送给您" size="large" />
                    </p>
                    <p>
                        <Button size="large" block htmlType="submit">
                            <RightCircleOutlined/> 登录
                        </Button>
                    </p>
                </form>
            </div>
        </div>
    );
}