import './Footer.less';

export function Footer() {
    return (
        <div className="footer">
            <p>
                Project <b>Guiding Star</b> by PKUGGG Team (build {process.env.REACT_APP_BUILD_INFO||'---'})
                <br />
                <a href="#/license">Open Source License</a>
            </p>
        </div>
    );
}