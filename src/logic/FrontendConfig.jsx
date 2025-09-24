import {createContext, useState, useEffect, useContext} from 'react';

const DEFAULT_CONFIG = {
    read_announcement_id: -1,

    ui_selected_theme: 'auto',
    ui_animation: 'on',

    portal_challenge_badge: 'category',
    portal_score_badge: 'deduction',

    notif_toast: 'off',
    notif_tts: 'off',

    toge: 'nashi',
};

const LOCALSTORAGE_KEY = 'gs_frontend_config_v1';

let FrontendConfigCtx = createContext({
    config: DEFAULT_CONFIG,
    theme: 'light',
    set_config: (delta_obj)=>{},
    clear_config: ()=>{},
});


export function FrontendConfigProvider({children}) {
    let [config, set_config] = useState(DEFAULT_CONFIG);

    // auto-reload

    useEffect(()=>{
        function update(e) {
            if(e && e.key && e.key!==LOCALSTORAGE_KEY) {
                return;
            }
            set_config({
                ...DEFAULT_CONFIG,
                ...JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) || '{}'),
            });
        }
        update(null);
        window.addEventListener('storage', update);
        return ()=>{
            window.removeEventListener('storage', update);
        };
    }, []);

    // theme

    function get_active_theme() {
        if (config.ui_selected_theme==='auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else {
            return config.ui_selected_theme;
        }
    }
    let [theme, set_theme] = useState(()=>get_active_theme());
    useEffect(() => {
        function update() {
            set_theme(get_active_theme());
        }
        update();
        if(config.ui_selected_theme==='auto') {
            let match = window.matchMedia('(prefers-color-scheme: dark)');
            match.addEventListener('change', update);
            return ()=>{
                match.removeEventListener('change', update);
            };
        }
    }, [config.ui_selected_theme]);

    // write

    function write_config(cfg) {
        set_config({
            ...DEFAULT_CONFIG,
            ...cfg,
        });
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(cfg));
    }

    function write_delta_config(delta_obj) {
        write_config({
            ...config,
            ...delta_obj,
        });
    }

    function clear_config() {
        write_config({});
    }

    return (
        <FrontendConfigCtx.Provider value={{
            config: config,
            theme: theme,
            set_config: write_delta_config,
            clear_config: clear_config,
        }}>
            {children}
        </FrontendConfigCtx.Provider>
    );
}

export function useFrontendConfig(k) {
    return useContext(FrontendConfigCtx);
}