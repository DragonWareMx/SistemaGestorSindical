import Layout from '../../layouts/Layout';


const inicio = ({}) => {

        return (
            <>
            Hola, éste es un inicio de prueba
            </>
        )
}

inicio.layout = page => <Layout children={page} title="Inicio" pageTitle="Inicio"/>

export default inicio
