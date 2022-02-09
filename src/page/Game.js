import {useNavigate} from 'react-router-dom';
import {Skeleton, message} from 'antd';

import {Reloader} from './GameLoading';
import {useGameInfo} from '../ctx/GameInfo';
import {TemplateFile} from '../widget/Template';
import {useWishData} from '../wish';

function GamePortal() {
    let [error, data, load_data] = useWishData('game');
    let nav = useNavigate();

    if(error) {
        if(error.error==='SHOULD_AGREE_TERMS') {
            message.info({content: error.error_msg, key: 'GamePortalError', duration: 2});
            nav('/user/terms');
        }
        if(error.error==='SHOULD_UPDATE_PROFILE') {
            message.info({content: error.error_msg, key: 'GamePortalError', duration: 2});
            nav('/user/profile');
        }

        return (
            <div className="slim-container">
                <Reloader message={error.error_msg} reload={load_data} />
            </div>
        );
    }
    if(data===null)
        return (
            <Skeleton />
        );

    return (
        <div>
            portal...
        </div>
    )
}

export function Game() {
    let info = useGameInfo();

    if(!info.feature.game)
        return (
            <div className="slim-container">
                <TemplateFile name="game" />
            </div>
        );
    else
        return (
            <GamePortal />
        );
}