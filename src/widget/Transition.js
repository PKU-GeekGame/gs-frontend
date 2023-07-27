import {SwitchTransition, CSSTransition} from 'react-transition-group';

import './Transition.less';

export function Transition({cur, children}) {
    return (
        <SwitchTransition>
            <CSSTransition
                key={cur}
                classNames="app-transition"
                timeout={83}
                unmountOnExit
            >
                {children}
            </CSSTransition>
        </SwitchTransition>
    );
}