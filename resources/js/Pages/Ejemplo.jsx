import Layout from '../layouts/Layout';
import Eliminar from '../components/common/Eliminar';


const Ejemplo = ({ }) => {

    return (
        <>
            <Eliminar oficina={'Honor y justicia'} ruta={'honor.delete'} id={'ee2e1ee5-8d06-43de-834e-3409c73b7dc3'} />
            Hola, éste es un inicio de prueba
        </>
    )
}

Ejemplo.layout = page => <Layout children={page} title="Inicio" pageTitle="Inicio" />

export default Ejemplo
