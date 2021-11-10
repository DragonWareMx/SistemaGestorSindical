import React, { useEffect } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { InertiaLink } from '@inertiajs/inertia-react';
import route from 'ziggy-js';


export default function Eliminar({ oficina, ruta, id, data }) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            < button type="button" className=" center-align btn waves-effect waves-light red"
                ref={(node) => {
                    if (node) {
                        node.style.setProperty("width", "120px", "important");
                    }
                }}
                style={{ marginRight: "15px", marginLeft: "0" }} onClick={handleClickOpen}>
                Eliminar
                <i className="material-icons right">delete</i>
            </button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Eliminar registro de " + oficina}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Estás seguro de que deseas eliminar este registro?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} style={{ color: 'black' }}>Cancelar</Button>
                    <InertiaLink href={route(ruta, id)} method="delete" as="button" type="button" data={data ? data : null} style={{ color: 'white', backgroundColor: 'red', fontFamily: '"Roboto","Helvetica","Arial",sans-serif', border: 'none', borderRadius: '4px', padding: '10 7', letterSpacing: ' 0.02857em', fontSize: '13.5px', cursor: 'pointer' }}>
                        ACEPTAR
                    </InertiaLink>
                </DialogActions>
            </Dialog>
        </div>


    )
}
