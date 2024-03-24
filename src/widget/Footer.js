import './Footer.less';

export function Footer() {
    return (
        <div className="footer">
            <p>
                build {process.env.REACT_APP_BUILD_INFO ? process.env.REACT_APP_BUILD_INFO : '---'}
            </p>
        </div>
    );
}