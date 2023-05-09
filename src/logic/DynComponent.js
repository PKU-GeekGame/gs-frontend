import {useMemo, Suspense, lazy} from 'react';
import {Skeleton} from 'antd';

function DynComponentLoader(url, name) {
    return lazy(async () => {
        function fetchRemote() {
            console.log('fetching dyn component', name, 'at', url);
            return new Promise((resolve, reject) => {
                const script=document.createElement("script");
                script.src=url;
                script.onload=() => {
                    resolve(window[name]);
                }
                script.onerror=reject;
                document.head.appendChild(script);
            });
        }

        // eslint-disable-next-line no-undef
        await __webpack_init_sharing__("default");
        const container=(window[name] || await fetchRemote()); // or get the container somewhere else
        // eslint-disable-next-line no-undef
        await container.init(__webpack_share_scopes__.default);
        const app=(await container.get('./App'))();
        return app;
    });
}

export function DynComponent({url, name}) {
    const DynComp=useMemo(()=>DynComponentLoader(url, name), [url, name]);

    return (
        <Suspense fallback={<Skeleton />}>
            <DynComp />
        </Suspense>
    );
}