import React, { useEffect, useState, useRef } from "react";
import { Inertia } from "@inertiajs/inertia";
import {
    withStyles,
    makeStyles,
    // createMuiTheme,
    ThemeProvider,
} from "@mui/styles";
import route from "ziggy-js";
import { InertiaLink, usePage } from "@inertiajs/inertia-react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import PublishIcon from "@mui/icons-material/Publish";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

const useStyles = makeStyles((theme) => ({
    input: {
        fontFamily: "Oxygen",
        fontStyle: "normal",
        fontSize: "15px",
        color: "#333333",
        borderColor: "#1DA3A8",
        "&:not(.Mui-disabled):hover::before": {
            borderColor: "#1DA3A8",
        },
    },
    formTextLabel: {
        fontFamily: "Atma",
        fontSize: "15px",
        color: "#9E9E9E",
    },
    root: {
        width: "100%",
        marginRight: "5%",
        "& .MuiOutlinedInput-input": {
            color: "#9c9c9c",
        },
        "& .MuiInputLabel-root": {
            color: "#9c9c9c",
        },
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            border: "none",
            borderRadius: "0px",
            borderBottom: "1px solid #8b8b8b",
        },
        "&:hover .MuiOutlinedInput-input": {
            color: "#1DA3A8",
        },
        "&:hover .MuiInputLabel-root": {
            color: "#1DA3A8",
        },
        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderBottom: "1px solid #1DA3A8",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
            color: "#8b8b8b",
        },
        "& .MuiInputLabel-root.Mui-focused": {
            color: "#8b8b8b",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
                borderColor: "#8b8b8b",
            },
    },
}));

const theme = makeStyles({
    palette: {
        secondary: {
            // light: will be calculated from palette.primary.main,
            main: "#ff4400",
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        primary: {
            light: "#0066ff",
            main: "#9c9c9c",
            // dark: will be calculated from palette.secondary.main,
            contrastText: "#ffcc00",
        },
        // error: will use the default color
    },
    status: {
        danger: "orange",
    },
});

const AgregarCosa = ({cosa, foto, link}) => {

    const inputFoto= useRef(null);
    const containerFoto=useRef(null);

    const classes = useStyles();

    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState("sm");

    // MODAL AGREGAR COSA
    const [open, setOpen] = React.useState(false);

    const handleClickOpenModal = () => {
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    function cosaURL() {
        var input = inputFoto.current
        if (input.files && input.files[0]) {
            setValues((values) => ({
                ...values,
                foto: input.files[0],
            }));
            var reader = new FileReader();
            var preview = containerFoto.current;
            reader.onload = function (e) {
                preview.src = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const [values, setValues] = React.useState({
        foto: null,
        nombre:'',
        observaciones:'',
        link:'',
        cosa:cosa || '',
    });

    function handleSubmitCosa(e) {
        e.preventDefault();

        Inertia.post(route("trophie.create"), values, {
            onError: () => {},
            onSuccess:()=>{
                setOpen(false)
                if(cosa=='marca' || cosa=='categoria'){
                    var preview = containerFoto.current
                    preview.src = '/img/icons/imgDefault.png'
                    setValues({...values, link : '',nombre : '',foto : null})
                }
                else
                    setValues({...values, nombre : '',foto : null})

            }
        });
    }

        return (
            <>
            <Grid
                className="link-add-bd"
                onClick={handleClickOpenModal}
            >
                Agregar {cosa}
            </Grid>
            <Dialog
            open={open}
            onClose={handleCloseModal}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            >

            <form>
                <DialogTitle className="title-dialog">
                    {"Agregar "+cosa}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-description"
                        className="dialog-content"
                    >
                        <ThemeProvider>
                            <Grid
                                item
                                xs={12}
                                style={{ marginBottom: "20px" }}
                            >
                                <TextField
                                    id="newMarca"
                                    type="text"
                                    label="Nombre"
                                    style={{ width: "100%" }}
                                    InputProps={{
                                        className: classes.input,
                                    }}
                                    InputLabelProps={{
                                        classes: {
                                            root: classes.formTextLabel,
                                        },
                                    }}
                                    value={values.nombre}
                                    onChange={handleChange('nombre')}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                style={{ marginBottom: "20px" }}
                            >
                                <TextField
                                    id="observaciones"
                                    type="text"
                                    label="Observaciones"
                                    style={{ width: "100%" }}
                                    InputProps={{
                                        className: classes.input,
                                    }}
                                    InputLabelProps={{
                                        classes: {
                                            root: classes.formTextLabel,
                                        },
                                    }}
                                    value={values.observaciones}
                                    onChange={handleChange('observaciones')}
                                />
                            </Grid>
                            {link &&
                                <Grid
                                item
                                xs={12}
                                style={{ marginBottom: "20px" }}
                                >
                                    <TextField
                                        id="link"
                                        type="text"
                                        label="Link"
                                        style={{ width: "100%" }}
                                        InputProps={{
                                            className: classes.input,
                                        }}
                                        InputLabelProps={{
                                            classes: {
                                                root: classes.formTextLabel,
                                            },
                                        }}
                                        value={values.link}
                                        onChange={handleChange('link')}
                                    />
                                </Grid>
                            }
                            {foto &&
                            <Grid
                            item
                            xs={12}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "15px",
                            }}
                        >
                            <img
                                src="/img/icons/imgDefault.png"
                                style={{
                                    marginRight: "15px",
                                    width: "30%",
                                    minWidth: "80px",
                                    maxHeight: "150px",
                                    objectFit: "cover",
                                }}
                                ref={containerFoto}
                            />
                            <input
                                accept="image/*"
                                ref={inputFoto}
                                type="file"
                                style={{ display: "none" }}
                                onChange={cosaURL}
                                id={'imgCosa'}
                            />
                            <label
                                htmlFor="imgCosa"
                                style={{ marginTop: "20px" }}
                            >
                                <Button
                                    variant="contained"
                                    className="button-add"
                                    startIcon={<PublishIcon />}
                                    component="span"
                                >
                                    Subir img
                                </Button>
                            </label>
                        </Grid>
                            }
                        </ThemeProvider>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Grid
                        item
                        xs={12}
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            padding: "8px 24px",
                            marginBottom: "10px",
                        }}
                    >
                        <Grid
                            className="btn-cancelar-op"
                            onClick={handleCloseModal}
                        >
                            CANCELAR
                        </Grid>
                        <Button
                            className="button-filter button-update btn-second"
                            type="button"
                            startIcon={<ArrowRightAltIcon />}
                            onClick={handleSubmitCosa}
                        >
                            Agregar
                        </Button>
                    </Grid>
                </DialogActions>
            </form>
        </Dialog>
     </>
        )
}

export default AgregarCosa
