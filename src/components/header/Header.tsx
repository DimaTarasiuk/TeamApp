import { Menu } from '../menu/Menu';
import logo from '../../source/svg/logo.svg';

import './header.scss'

export const Header = () => {
  return (
    <header className='header'>
      <img className="logo" src={logo} alt="logo" />

      <Menu />
    </header>
  )
}
