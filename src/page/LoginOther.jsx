import {Alert, Button, App} from 'antd';
import {GithubOutlined, WindowsOutlined, HomeOutlined} from '@ant-design/icons';

import {to_auth} from '../utils';

import './LoginOther.less';

export function LoginOther() {
    let {message} = App.useApp();
    return (
        <div className="slim-container">
            <Alert showIcon message={<b>校外选手注意事项</b>} description={<>
                <p>
                    我们允许校外选手通过 OAuth 登录一同参与比赛。
                    校外选手不参与评奖，但可以正常解答题目，分数会出现在总排行榜上。
                    我们将为成绩优秀的校外选手颁发成绩证明和纪念品。
                </p>
                <p>
                    校外选手答题将不影响动态分值机制，即题目分数只受校内解出人数影响。
                </p>
                <p>
                    校外选手同样需要遵守 <a href="#/user/terms">诚信比赛须知</a>，在比赛结束前不得公布解法或提示，不得代打或与他人合作。
                </p>
                <p>
                    在解题时请遵守法律法规，仅可攻击题目指定的主机。
                    如果选手在解题时非法访问或破坏了其他无关系统，将承担相应的法律责任。
                </p>
            </>} />

            <br />

            <div className="login-instruction">
                <p><b>选择登录方式</b></p>
                <p>
                    <Button size="large" onClick={()=>to_auth('github/login', message)}>
                        <GithubOutlined /> GitHub
                    </Button>
                    &emsp;
                    <Button size="large" onClick={()=>to_auth('microsoft/login', message)}>
                        <WindowsOutlined /> Microsoft
                    </Button>
                </p>

                <br />
                <hr />
                <br />

                <p className="login-pku-warning"><b>北京大学校内选手注意</b></p>
                <p>
                    本竞赛不允许选手注册多个账号，校内选手务必全程通过北京大学统一身份认证（IAAA）系统登录，否则视为放弃评奖资格。
                </p>
                <p>
                    <Button size="large" onClick={()=>to_auth('pku/redirect', message)}>
                        <HomeOutlined /> 北京大学登录
                    </Button>
                </p>
            </div>
        </div>
    );
}