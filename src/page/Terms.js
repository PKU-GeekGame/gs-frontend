import {useContext} from 'react';
import {Button, message} from 'antd';
import {useNavigate} from 'react-router-dom';
import {CheckCircleOutlined} from '@ant-design/icons';

import {GameInfoCtx} from '../logic/GameInfo';
import {TemplateFile} from '../widget/Template';
import {wish} from '../wish';

export function Terms() {
    let {info, reload_info} = useContext(GameInfoCtx);
    let nav = useNavigate();

    function agree_term() {
        message.loading({content: '正在保存…', key: 'Terms', duration: 10});
        if(window._anticheat_report)
            window._anticheat_report();

        wish('agree_term', {})
            .then((res)=>{
                if(res.error)
                    message.error({content: res.error_msg, key: 'Terms', duration: 3});
                else {
                    message.success({content: '保存成功', key: 'Terms', duration: 2});
                    reload_info();
                    nav('/');
                }
            });
    }

    return (
        <div className="slim-container">
            <h1>参赛须知</h1>
            <TemplateFile name="terms" />
            <br />
            {info.user!==null && (
                info.user.terms_agreed ?
                    <Button type="primary" size="large" block disabled>
                        <CheckCircleOutlined /> 已同意参赛须知
                    </Button> :
                    <Button type="primary" size="large" block onClick={agree_term}>
                        <CheckCircleOutlined /> 我理解并同意参赛须知
                    </Button>
            )}
        </div>
    );
}