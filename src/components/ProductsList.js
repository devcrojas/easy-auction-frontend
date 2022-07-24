import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import AuthService from '../services/auth.service'
import 'react-slideshow-image/dist/styles.css'
import ProductCard from './ProductCard';
import axios from 'axios';

function ProductsList(props) {

    const [apis, setApis] = useState([]);
    const [user, setUser] = useState(AuthService.getCurrentUser());

    useEffect(() => {
        getProductos()
    }, [])

    let getProductos = async function () {
        let products;
        let awProduc;
        // Valida en que vista se encuentra y dependiendo de eso realiza la peticion
        switch (props.actualView) {
            // Vista general de productos
            case 'productsList':
                products = await fetch("/api/products", { method: "GET" } );
                awProduc = await products.json();
                setApis(awProduc);
            break;
            // Vista de mis productos
            case 'myProducts':
                let userEmail = { email:user.id}
                products = await axios.post('/api/products/myproducts',JSON.stringify(userEmail),{
                                            headers: { 'Authorization': localStorage.getItem("token"),
                                            'Content-Type': 'application/json' }});
                awProduc = await products.data;
                setApis(awProduc);
            break;
            // Vista de mis compras
            case 'myShoppings':
                let profileWin = { profileWin:user.id}
                let fProducts = await fetch('/api/products/myearnedproducts',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(profileWin)
                }
                );
                awProduc = await fProducts.json();
                setApis(awProduc);
            break;
            // Por si no manda ninguna vista o manda una vista que no existe
            default:
                console.log('Vista no registrada');
            break;
        }
        return;
    }

    const cardList = () => {
        // Cicla los resultados de la peticion
        let card = apis.map((producto) => {
             // Si la vista es de mis productos que no muestre los cancelados
             if(props.actualView === 'myProducts' && producto.status !== 'cancelled'){
                return (
                    <Col sx={12} lg={6} key={producto._id} className='mb-5'>
                        <ProductCard product={producto} actualView={props.actualView}></ProductCard>
                    </Col>
                )
            }
            // Si la vista es la lista de productos que muestre todo como llega
            else {
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
