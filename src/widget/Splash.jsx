import {useState, useRef} from 'react';
import {createPortal} from 'react-dom';
import {useNavigate} from 'react-router';
import {Alert, Button} from 'antd';

import {TemplateFile} from './Template';
import {useFrontendConfig} from '../logic/FrontendConfig';

import './Splash.less';

export function BannedSplash({error_msg, splash_msg}) {
    let {config} = useFrontendConfig();
    let nav = useNavigate();

    return (
        <div className="slim-container">
            <Alert type="error" message={error_msg} showIcon/>
            <br/>
            <TemplateFile name="game"/>
        </div>
    );
}

const CONGRAT_EMOJIS = ['👍', '⭐', '🤩', '🌟', '⛳', '✅', '👋', '😎', '🐮', '🎉', '💯', '🆒'];

export function FlagCorrectSplash() {
    /*
    let {config} = useFrontendConfig();
    let emoji = useRef(CONGRAT_EMOJIS[Math.floor(Math.random() * CONGRAT_EMOJIS.length)]);

    if(config.toge!=='ari')
        return null;

    return createPortal((
        <div className="flag-correct-splash">{emoji.current}</div>
    ), document.body);
    */

    return null;
}