import Layout from '../../layouts/Layout';
import { Container } from '@mui/material';


const inicio = ({}) => {

        return (
            <>
            <div className="row">
            <Container>
                <div className="col contenedor s12">
                    <div className="card darken-1 cardUsers">
                        <div className="card-content">
                            <div className="col s12 m9 l10 xl10 titulo-modulo left" style={{ marginTop: "15px" }}>
                                {/* regresar */}
                                <InertiaLink href={route('accionFemenil')} className="icon-back-course tooltipped" data-position="left" data-tooltip="Regresar"><i className="material-icons">keyboard_backspace</i></InertiaLink>
                                REGISTRO
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            </div>
            </>
        )
}

inicio.layout = page => <Layout children={page} title="Inicio" pageTitle="Inicio"/>

export default inicio
