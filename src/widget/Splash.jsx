import {useState, useRef} from 'react';
import {createPortal} from 'react-dom';
import {useNavigate} from 'react-router-dom';
import {Alert, Button} from 'antd';

import {Logo} from '../branding';
import {TemplateFile} from './Template';
import {useFrontendConfig} from '../logic/FrontendConfig';

import './Splash.less';

export function BannedSplash({error_msg, splash_msg}) {
    let [popup, set_popup] = useState(true);
    let {config} = useFrontendConfig();
    let nav = useNavigate();

    if(config.toge!=='ari')
        popup = false;

    return (
        <div className="slim-container">
            <Alert type="error" message={error_msg} showIcon/>
            {popup === true && <div className="banned-splash">
                <div><Logo/></div>
                <h1>你号没了</h1>
                <p>{splash_msg}</p>
                <div>
                    <Button type="text" danger={true} size="large"
                            onClick={() => nav('/info/announcements')}>查看比赛公告</Button>
                    &ensp;
                    <Button type="text" danger={true} size="large" onClick={() => set_popup(false)}>知道了</Button>
                </div>
            </div>}
            <br/>
            <TemplateFile name="game"/>
        </div>
    );
}

const CONGRAT_EMOJIS = ['👍', '⭐', '🤩', '🌟', '⛳', '✅', '👋', '😎', '🐮', '🎉', '💯', '🆒'];

export function FlagCorrectSplash() {
    let {config} = useFrontendConfig();
    let emoji = useRef(CONGRAT_EMOJIS[Math.floor(Math.random() * CONGRAT_EMOJIS.length)]);

    if(config.toge!=='ari')
        return null;

    return createPortal((
        <div className="flag-correct-splash">{emoji.current}</div>
    ), document.body);
}