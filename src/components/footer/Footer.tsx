import logo from '../../source/svg/logo.svg';

import './footer.scss'

export const Footer = () => {
    return (
        <footer className='footer'>
            <img className="logo" src={logo} alt="logo" />
            <p className='footer__copy'>Copyright &#169; Anna-Shy</p>
        </footer>
    )
}
