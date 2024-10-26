(()=>{
    // prefetch gameinfo

    window._gameinfo_prefetch = fetch('{__WISH_ROOT__}game_info', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'X-Wish-Version': '{__WISH_VER__}',
            'Content-Type': 'application/json',
        },
        body: '{}',
    });
    setTimeout(()=>{
        // the prefetched data will be cleared aftered consumed by the script,
        // but we also use a timer to clear it just in case the script is too slow to load
        window._gameinfo_prefetch = null;
    }, 15000);

    // prefetch game template

    let elem = document.createElement('link');
    elem.rel = 'prefetch';
    elem.href = '{__TEMPLATE_ROOT__}game';
    elem.crossOrigin = 'use-credentials';
    document.head.appendChild(elem);
})();