import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import AuthService from '../services/auth.service'
import 'react-slideshow-image/dist/styles.css'
import ProductCard from './ProductCard';
import axios from 'axios';
import PointsService from '../services/points.service'


function ProductsList(props) {

    const [apis, setApis] = useState([]);
    const [user, setUser] = useState(AuthService.getCurrentUser());
    //const [pointsUser, setPointsUser] = useState(null);
    const [response, setResponse] = useState("");
    const [cards, setCards] = useState();

    useEffect(() => {
        let getProductos = async function () {
            let products;
            let awProduc;
            // Valida en que vista se encuentra y dependiendo de eso realiza la peticion
            switch (props.actualView) {
                // Vista general de productos
                case 'productsList':
                    products = await fetch("/api/products", { method: "GET" });
                    awProduc = await products.json();
                    //console.log(awProduc);
                    setApis(awProduc);
                    break;
                // Vista de mis productos
                case 'myProducts':
                    let userEmail = { profile: user.id }
                    products = await axios.post('/api/products/myproducts', JSON.stringify(userEmail), {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem("token"),
                            'Content-Type': 'application/json'
                        }
                    });
                    awProduc = await products.data;
                    setApis(awProduc);
                    break;
                // Por si no manda ninguna vista o manda una vista que no existe
                default:
                    console.log('Vista no registrada');
                    break;
            }
            return;
        }
        getProductos();
        //console.log("Iniciando get de puntos...");
        //console.log(props);
        /*/let getPoints = async function () {
            setPointsUser(await PointsService.getPointsByUserId(user.id))
        }
        getPoints();/*/
      // initiate the register from the client
    }, [user, props])

    

    const cardList = () => {
        // Cicla los resultados de la peticion
        let card = apis.map((producto) => {
            // Si la vista es de mis productos que no muestre los cancelados
            if (props.actualView === 'myProducts' && producto.status !== 'cancelled') {
                return (
                    <Col sx={12} lg={6} key={producto._id} className='mb-5'>
                        <ProductCard product={producto} actualView={props.actualView} user={user} pointsUser={props.pointsUser} setPointsUser={props.setPointsUser}></ProductCard>
                    </Col>
                )
            }
            // Si la vista es la lista de productos que muestre todo como llega
            else {
                if (props.pointsUser !== null) {
                    return (
                        <Col sx={12} md={12} lg={6} key={producto._id} className='mb-5'>
                            <ProductCard product={producto} actualView={props.actualView} pointsUser={props.pointsUser} setPointsUser={props.setPointsUser} user={user}></ProductCard>
                        </Col>
                    )
                } else {
                    return (
                        <Col sx={12} md={12} lg={6} key={producto._id} className='mb-5'>
                            <ProductCard product={producto} actualView={props.actualView} pointsUser={props.pointsUser}  setPoints={props.setPointsUser}></ProductCard>
                        </Col>
                    )
                }
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
