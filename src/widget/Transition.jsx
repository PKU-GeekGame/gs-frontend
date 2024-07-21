import {useRef} from 'react';
import {SwitchTransition, CSSTransition} from 'react-transition-group';

import './Transition.less';

export function Transition({cur, children}) {
    let noderef = useRef();
    return (
        <SwitchTransition>
            <CSSTransition
                key={cur}
                classNames="app-transition"
                timeout={100}
                nodeRef={noderef}
                unmountOnExit
            >
                <div ref={noderef}>
                    {children}
                </div>
            </CSSTransition>
        </SwitchTransition>
    );
}