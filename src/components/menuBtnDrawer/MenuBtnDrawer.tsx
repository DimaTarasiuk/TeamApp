import React, { useState } from 'react';

import { userInfoData } from '../../source/data/UserInfoData';
import { Box, Button, Drawer } from '@mui/material';

import './menuBtnDrawer.scss';

type Anchor = "right";

export const MenuBtnDrawer = ({ title }: { title: string }) => {
    const [state, setState] = useState({ right: false });

    const toggleDrawer = (anchor: Anchor, open: boolean) => () => {
        setState({ ...state, [anchor]: open });
    };

    const drawerCard = (anchor: Anchor) => (
        <Box
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
            className="drawerBox__card"
        >
            {/* test data */}
            {userInfoData.map((user, key) => (
                <div className="userCard" key={key}>
                    <h2 className="userCard-title">{user.username}</h2>

                    <div className="userCard-aboutWork">
                        <p className='aboutWork-workData'>{user.timeDayWork}</p>
                        <p className="aboutWork-position">{user.position}</p>
                    </div>
                </div>
            ))}
        </Box>
    );

    return (
        <>
            {(["right"] as const).map((anchor) => (
                <React.Fragment key={anchor}>
                    <Button
                        disabled={false}
                        size="medium"
                        variant="outlined"
                        className='menu-btn'
                        onClick={toggleDrawer(anchor, true)}
                    >
                        {title}
                    </Button>

                    <Drawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                    >
                        {drawerCard(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </>
    )
}
