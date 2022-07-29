import React, { useState } from 'react';
import { Container, Col, Modal, Row } from 'react-bootstrap';
import { Zoom } from 'react-slideshow-image';
import NavBarMenu from './NavBarMenu';
import MenuLateral from './MenuLateral';
import ProductsList from './ProductsList';
import profile from './Profile';
import 'react-slideshow-image/dist/styles.css'
import AuthService from '../services/auth.service';

function MyShoppings() {
    const [profile] = useState(AuthService.getCurrentUser().profile);
    const [user] = useState(AuthService.getCurrentUser());
    return (
        <>
            <NavBarMenu view={"Products"} user={user.profile}></NavBarMenu>
                <Container fluid style={{ background: "#F0F2F5" }}>
                    <Row>
                    <Col xs={3} className="sidebarEasy">
                        <MenuLateral view={""} imgProfile={profile.file}></MenuLateral>
                    </Col>
                    <Col xs={9}>
                        <ProductsList actualView={'myShoppings'}></ProductsList>
                    </Col>
                    </Row>
                </Container>
        </>
    )
}

export default MyShoppings;