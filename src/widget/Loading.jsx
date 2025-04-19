import {LoadingOutlined} from '@ant-design/icons';

import './Loading.less';

export function Loading({height=400}) {
    return (
        <div className="loading-indicator" style={{height: height + 'px', lineHeight: height + 'px'}}>
            <p><LoadingOutlined/>{' '}加载中</p>
        </div>
    );
}