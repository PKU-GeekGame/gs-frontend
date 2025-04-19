import {useRef} from 'react';
import {SwitchTransition, CSSTransition} from 'react-transition-group';

import {useFrontendConfig} from '../logic/FrontendConfig';

import './Transition.less';

export function Transition({cur, children, skipexit=false}) {
    let {config} = useFrontendConfig();
    let noderef = useRef();

    if(config.ui_animation==='no_transition' || config.ui_animation==='off')
        return children;

    return (
        <SwitchTransition>
            <CSSTransition
                key={cur}
                classNames="app-transition"
                timeout={{
                    enter: 100,
                    exit: skipexit ? 0 : 100,
                }}
                nodeRef={noderef}
                unmountOnExit
            >
                <div className="comment" ref={noderef}> {/* class=comment will disable safari's reader */}
                    {children}
                </div>
            </CSSTransition>
        </SwitchTransition>
    );
}