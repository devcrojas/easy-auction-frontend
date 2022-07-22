import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import 'react-slideshow-image/dist/styles.css'
import ProductCard from './ProductCard';

function ProductsList(props) {

    const [apis, setApis] = useState([]);

    useEffect(() => {
        getProductos()
    }, [])

    let getProductos = async function () {
        let produc = await fetch("/api/products",
            {
                method: "GET"
            }
        );
        let awProduc = await produc.json();
        setApis(awProduc);
        return;
    };

    const cardList = () => {
        // Cicla los resultados de la peticion
        let card = apis.map((producto) => {
            // Pregunta si existe algun filtro, de lo contrario mostrara todas
            if(props.filter){
                // Pregunta si el campo a filtrar esta en un sub objeto
                if(props.isSubObject){
                    // Realiza la comparacion para buscar el valor en el sub objeto
                    if(props.filterValue === producto[props.subObject][props.filterField]){
                        return (
                            <Col sx={12} lg={6} key={producto._id} className='mb-5'>
                                <ProductCard product={producto} actualView={props.actualView}></ProductCard>
                            </Col>
                        )
                    }
                }else{
                    // Si no se esta buscando sobre un sub objeto buscar por arriba del objeto principal
                    if(props.filterValue === producto[props.filterField]){
                        return (
                            <Col sx={12} lg={6} key={producto._id} className='mb-5'>
                                <ProductCard product={producto} actualView={props.actualView}></ProductCard>
                            </Col>
                        )
                    }
                }
            }else{
                // Si no se esta filtrando que traiga todas las cards
                return (
                    <Col sx={12} lg={6} key={producto._id} className='mb-5'>
                        <ProductCard product={producto} actualView={props.actualView}></ProductCard>
                    </Col>
                )
            }
        });
        return card
    }
    return (
        <>
            <Container>
                <Row md="auto" className='d-flex justify-content-around mt-3'>
                    <>
                        {
                            cardList()
                        }
                    </>
                </Row>
            </Container>
        </>
    )
}

export default ProductsList;
