import Layout from '../layouts/Layout';


const Ejemplo = ({}) => {

        return (
            <>
            Hola, éste es un inicio de prueba
            </>
        )
}

Ejemplo.layout = page => <Layout children={page} title="Inicio" pageTitle="INICIO"/>

export default Ejemplo
