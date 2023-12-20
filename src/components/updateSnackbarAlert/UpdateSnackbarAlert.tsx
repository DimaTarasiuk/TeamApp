import React, { forwardRef } from 'react';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface UpdateSnackbarAlert {
    openAlert: boolean;
    onClose: () => void;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const vertical: 'top' | 'bottom' = 'top';
const horizontal: 'left' | 'center' | 'right' = 'center';

export const UpdateSnackbarAlert: React.FC<UpdateSnackbarAlert> = ({
    openAlert,
    onClose,
}) => {
    return (
        <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={openAlert}
            autoHideDuration={5000}
            onClose={onClose}
        >
            <Alert onClose={onClose} severity="success">
                Updated
            </Alert>
        </Snackbar>
    );
};
