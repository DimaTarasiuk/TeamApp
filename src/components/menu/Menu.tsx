import { MenuBtnAlert } from '../menuBtnAlert/MenuBtnAlert';
import { MenuBtnDrawer } from '../menuBtnDrawer/MenuBtnDrawer';

import './menu.scss';

export const Menu = () => {
    return (
        <nav className="menu">
            <MenuBtnDrawer title={'Info'} />
            <MenuBtnAlert title={'Update data'} />
        </nav>
    )
}
