import Layout from '../layouts/Layout';
import Eliminar from '../components/common/Eliminar';
import { Container } from '@mui/material';
import '/css/usersStyle.css'
import '/css/users.css'


const Ejemplo = ({ }) => {

    return (
        <>
            {/* <Eliminar oficina={'Honor y justicia'} ruta={'honor'} /> */}

            <div className="row">
                <Container>
                    <div className="col contenedor s12">
                        <div className="card darken-1 cardUsers">
                            {/* <InertiaLink className="btn-floating btn-large waves-effect waves-light green-sind button-addUser" href={route('logs.create')}><i className="material-icons">add</i></InertiaLink> */}
                            <div className="card-content">
                                <span className="card-title">¡BIENVENIDO DE NUEVO!</span>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <img src="/img/imagenes/Hello.gif" alt="https://storyset.com/people" style={{ marginRight: 'auto', marginLeft: 'auto', width: '40%' }}></img>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    )
}

Ejemplo.layout = page => <Layout children={page} title="Inicio" pageTitle="Inicio" />

export default Ejemplo
