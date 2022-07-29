import React, { useState, useEffect } from 'react';
import { Container, Col, Modal, Row } from 'react-bootstrap';
import { Zoom } from 'react-slideshow-image';
import NavBarMenu from './NavBarMenu';
import MenuLateral from './MenuLateral';
import ProductsList from './ProductsList';
import profile from './Profile';
import 'react-slideshow-image/dist/styles.css'
import AuthService from '../services/auth.service';
import PointsService from '../services/points.service'


function MyShoppings() {
    const [profile] = useState(AuthService.getCurrentUser().profile);
    const [user] = useState(AuthService.getCurrentUser());
    const [pointsUser, setPointsUser] = useState();

    useEffect(()=>{
        const getPoints = async function () {
            //console.log("Hola");
            let data = await PointsService.getPointsByUserId(user.id);
            setPointsUser(data[0])
          }
          getPoints();
    },[])
    return (
        <>
            <NavBarMenu view={""} user={user.profile} pointsUser={pointsUser}></NavBarMenu>
                <Container fluid style={{ background: "#F0F2F5" }}>
                    <Row>
                    <Col id="sidebarEasy" xs={3} style={{ position: "fixed", width: "25%", overflowY:"scroll" }} className="sidebarEasy">
                        <MenuLateral view={"MyShops"} imgProfile={profile.file}></MenuLateral>
                    </Col>
                    <Col  xs={9} style={{ width: "75%", marginLeft: "25%" }}>
                        <ProductsList setPointsUser={setPointsUser} pointsUser={pointsUser}  actualView={'myShoppings'}></ProductsList>
                    </Col>
                    </Row>
                </Container>
        </>
    )
}

export default MyShoppings;
