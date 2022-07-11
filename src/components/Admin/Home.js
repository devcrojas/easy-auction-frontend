import React, { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import "../../nav.css"
import NavBarMenu from '../NavBarMenu'
import MenuLateral from './MenuLateralAdmin';

function Home() {


    return (
        <>
            <NavBarMenu view={"Admin"} user={"Perfil Facke"}></NavBarMenu>

            <Container fluid style={{ background: "#F0F2F5" }}>
                <Row>
                    <Col xs={3} className="sidebarEasy">
                        <MenuLateral view={""} profileImg={"imageProfile"}></MenuLateral>
                    </Col>
                    <Col xs={9} className="p-2">
                        <h1>Contenido</h1>
                    </Col>
                </Row>
            </Container>
        </>


    )
}

export default Home