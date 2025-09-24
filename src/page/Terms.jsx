import {useContext} from 'react';
import {Button, App} from 'antd';
import {useNavigate} from 'react-router';
import {CheckCircleOutlined} from '@ant-design/icons';

import {GameInfoCtx} from '../logic/GameInfo';
import {TemplateFile} from '../widget/Template';
import {ANTICHEAT_REPORT} from '../branding';
import {wish} from '../wish';

export function Terms() {
    let {info, reload_info} = useContext(GameInfoCtx);
    let nav = useNavigate();
    let {message} = App.useApp();

    function agree_term() {
        message.loading({content: '正在保存…', key: 'Terms', duration: 10});
        void ANTICHEAT_REPORT();

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
                        <CheckCircleOutlined /> 本队伍已同意参赛须知
                    </Button> :
                    <Button type="primary" size="large" block onClick={agree_term}>
                        <CheckCircleOutlined /> 本队伍已理解并同意参赛须知
                    </Button>
            )}
        </div>
    );
}