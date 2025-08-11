import {PieChartFilled, SwapOutlined} from '@ant-design/icons';
import {Fragment} from 'react';
import {Tooltip} from 'antd';

import {useFrontendConfig} from '../logic/FrontendConfig';

import './ChallengeAttrs.less';

export function TotScoreByCat({data}) {
    data = data ? data.filter((cat)=>cat[0]!=='Tutorial') : [];
    if(data.length===0)
        return null;

    return (
        <div className="tot-score-by-cats">
            <PieChartFilled />{' '}
            {data.map((cat, idx)=>(
                <Fragment key={cat}>
                    {idx!==0 ? ' + ' : null}
                    {cat[0]} {cat[1]}
                </Fragment>
            ))}
        </div>
    );
}

export function ChallengeBadgeModeSwitcher() {
    let {config, set_config} = useFrontendConfig();

    return (
        <span
            className="chall-mode-switch-btn"
            onClick={()=>set_config({portal_challenge_badge: config.portal_challenge_badge==='category' ? 'id' : 'category'})}
        >
            <Tooltip title={<>当前显示：{config.portal_challenge_badge==='category' ? '题目分类' : '题目 ID'}<br />点击切换</>}>
                (<SwapOutlined />)
            </Tooltip>
        </span>
    );
}