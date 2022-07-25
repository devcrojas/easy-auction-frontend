import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import "../../nav.css"
import NavBarMenu from '../NavBarMenu'
import MenuLateral from './MenuLateralAdmin';
import AuthService from '../../services/auth.service';

function Home() {

    return (
        <>
            <NavBarMenu view={"Admin"} ></NavBarMenu>

            <Container fluid style={{ background: "#F0F2F5", minHeight: "100vh" }}>
                <Row>
                    <Col xs={3} id="sidebarEasy" className="sidebarEasy" style={{position:"fixed", width:"25%"}}>
                        <MenuLateral view={""} profileImg={"imageProfile"}></MenuLateral>
                    </Col>
                    <Col xs={9} style={{width:"75%", marginLeft:"25%"}}>
                        <h1>Contenido</h1>
                    </Col>
                </Row>
            </Container>
        </>


    )
}

export default Home