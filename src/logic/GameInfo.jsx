import {createContext, useState, useContext} from 'react';

import {GameLoading} from '../page/GameLoading';
import {PushDaemon} from './PushDaemon';

export let GameInfoCtx = createContext({
    info: {
        user: {
            id: null,
            login_key: '',
            group: '',
            group_disp: '',
            token: '',
            profile: {
                nickname: '',
                tel: '',
                email: '',
                stuid: '',
                qq: '',
                comment: '',
            },
            terms_agreed: false,
        },
        feature: {
            push: false,
            game: false,
            submit_flag: false,
            templates: [],
        },
        cur_tick: 0,
        diag_ts: 0,
    },
    reload_info: ()=>{},
});

export function GameInfoProvider({children}) {
    let [value, set_value] = useState(null);

    function reload_info() {
        set_value(null);
    }

    return (
        <GameInfoCtx.Provider value={{
            info: value,
            reload_info: reload_info,
        }}>
            {value!==null && value.feature.push ? <PushDaemon info={value} reload_info={reload_info} /> : null}
            {value===null ? <GameLoading set_info={set_value} /> : children}
        </GameInfoCtx.Provider>
    );
}

export function useGameInfo() {
    let {info} = useContext(GameInfoCtx);
    return info;
}