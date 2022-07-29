import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import AuthService from '../services/auth.service'
import 'react-slideshow-image/dist/styles.css'
import ProductCard from './ProductCard';
import axios from 'axios';


function ProductsList(props) {

    const [apis, setApis] = useState([]);
    const [user, setUser] = useState(AuthService.getCurrentUser());
    //const [pointsUser, setPointsUser] = useState(null);

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
                // Vista de mis compras
                case 'myShoppings':
                    let profileWin = { profileWin:user.id}
                    let fProducts = await fetch('/api/products/myearnedproducts',
                        {
                            method: 'POST',
                            headers: { 'Authorization':'Bearer '+ localStorage.getItem("token"), 'Content-Type': 'application/json' },
                            body: JSON.stringify(profileWin)
                        }
                        );
                        awProduc = await fProducts.json();
                        setApis(awProduc);
                    break;
                case 'adminShoppings':
                    let bodyAdminShop = { status: "purchased"}
                    let adminProducts = await fetch('/api/products/getProductByStatus',
                        {
                            method: 'POST',
                            headers: { 'Authorization':'Bearer '+ localStorage.getItem("token"), 'Content-Type': 'application/json' },
                            body: JSON.stringify(bodyAdminShop)
                        }
                        );
                        adminProducts = await adminProducts.json();
                        setApis(adminProducts);
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
                    <Col sx={12} md={12} lg={6} key={producto._id} className='mb-5'>
                        <ProductCard product={producto} actualView={props.actualView} user={user} pointsUser={props.pointsUser} setPointsUser={props.setPointsUser}></ProductCard>
                    </Col>
                )
            }
            // Si la vista es de mis compras
            if(props.actualView === 'myShoppings' || props.actualView ===  'adminShoppings'){
                return (
                    <Col sx={12} md={12} lg={6} key={producto._id} className='mb-5'>
                        <ProductCard product={producto} actualView={props.actualView} user={user} pointsUser={props.pointsUser} setPointsUser={props.setPointsUser}></ProductCard>
                    </Col>
                )
            }
            
            // Si la vista es la lista de productos que muestre todo como llega
            else {
                //! Nunca usar una pocision estatica de un array sin validar antes, puede ocasionar problemas si este no llega a existir
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
