import Layout from '../layouts/Layout';
import Eliminar from '../components/common/Eliminar';


const Ejemplo = ({ }) => {

    return (
        <>
            <Eliminar oficina={'Honor y justicia'} ruta={'honor'} />
            Hola, éste es un inicio de prueba
        </>
    )
}

Ejemplo.layout = page => <Layout children={page} title="Inicio" pageTitle="Inicio" />

export default Ejemplo
