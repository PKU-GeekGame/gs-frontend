import {createContext, useState} from 'react';

import {GameLoading} from '../page/GameLoading';

export let GameInfoCtx = createContext({
    user: {
        id: null,
        group: '',
        token: '',
        profile: {
            nickname: '',
        },
    },
    feature: {
        game: false,
        push: false,
    },
});

export function GameInfoProvider({children}) {
    let [value, set_value] = useState(null);

    return (
        <GameInfoCtx.Provider value={value}>
            {value===null ? <GameLoading set_info={set_value} /> : children}
        </GameInfoCtx.Provider>
    );
}