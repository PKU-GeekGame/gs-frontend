import {useGameInfo} from '../logic/GameInfo';
import {Button, message} from 'antd';
import {CopyOutlined} from '@ant-design/icons';

import copy from 'copy-to-clipboard';

import './TokenWidget.less';

export function TokenWidget() {
    let info = useGameInfo();

    function do_copy_token() {
        if(copy(info.user.token))
            message.success({content: '已复制', key: 'TokenWidget', duration: 2});
    }

    return (
        <div className="token-widget">
            <Button onClick={do_copy_token} size="small"><CopyOutlined /> 复制队伍Token</Button>
            <span>部分题目需要输入队伍 Token 来验证身份，与其他队伍分享此 Token 将视为作弊。</span>
        </div>
    );
}