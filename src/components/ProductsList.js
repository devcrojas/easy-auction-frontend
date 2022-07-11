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
                // Para filtrar sobre datos del vendedor
                if(props.filterValue === producto.sellerData[props.filterField]){
                    return (
                        <Col sx={12} lg={6} key={producto._id} className='mb-5'>
                            <ProductCard product={producto}></ProductCard>
                        </Col>
                    )
                }
            }else{
                return (
                    <Col sx={12} lg={6} key={producto._id} className='mb-5'>
                        <ProductCard product={producto}></ProductCard>
                    </Col>
                )
            }
        });
        return card
    }
    return (
        <>
            <Container>
                <Row md="auto" className='d-flex justify-content-around mt-5'>
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
