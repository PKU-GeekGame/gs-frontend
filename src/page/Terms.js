import {useContext} from 'react';
import {Button, message} from 'antd';
import {CheckCircleOutlined} from '@ant-design/icons';

import {GameInfoCtx} from '../ctx/GameInfo';
import {TemplateFile} from '../widget/Template';
import {wish} from '../wish';
import {useNavigate} from 'react-router-dom';

export function Terms() {
    let {info, reload_info} = useContext(GameInfoCtx);
    let nav = useNavigate();

    function agree_term() {
        wish('/agree_term', {})
            .then((res)=>{
                if(res.error)
                    message.error(res.error_msg, 3);
                else {
                    message.success('保存成功', 2);
                    reload_info();
                    nav('/');
                }
            })
    }

    return (
        <div className="slim-container">
            <TemplateFile name="terms" />
            <br />
            {info.user.terms_agreed ?
                <Button type="primary" size="large" block disabled>
                    <CheckCircleOutlined /> 已同意比赛须知
                </Button> :
                <Button type="primary" size="large" block onClick={agree_term}>
                    <CheckCircleOutlined /> 我理解并同意比赛须知
                </Button>
            }
        </div>
    );
}