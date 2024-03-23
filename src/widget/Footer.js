import './Footer.less';
import {ExtLink} from '../utils';

export function Footer() {
    return (
        <div className="footer">
            <p>
                Powered by Project <b><ExtLink href="https://github.com/PKU-GeekGame/guiding-star">Guiding Star</ExtLink></b>
                {process.env.REACT_APP_BUILD_INFO ? ' ('+process.env.REACT_APP_BUILD_INFO+')' : null}
            </p>
        </div>
    );
}