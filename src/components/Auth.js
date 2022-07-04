import { React, useState } from 'react'
import { useNavigate } from "react-router-dom";

import { Button, Container, Form, Row, Col, Image, Offcanvas, CloseButton } from 'react-bootstrap'
import authService from '../services/auth.service'
import logoAuth from '../images/EasyAuction.gif'
import googleSSO from '../images/gmail_sso.png'
import { GiChecklist } from 'react-icons/gi';
import { SiWebauthn } from 'react-icons/si';
import { RiLoginCircleLine } from 'react-icons/ri';
import Register from './Register';

import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'

function Auth() {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [user, setUser] = useState({
        email: '',
        pass: ''
    });
    const handleInputChange = (event) => {
        setUser({
            ...user,
            [event.target.name]: event.target.value
        })
    }
    async function sendUser() {
        //console.log("Enviando datos");
        var data = await authService.login(user);
        data = await data.json();
        if (data.status !== -1) {
            localStorage.setItem("token", data.data.token);
            //Evita que el usuario regrese con el boton de volver al login.
            navigate("/producto", { replace: true });
        } else {
            localStorage.removeItem("token");
            console.log(data);
            Swal.fire({
                icon: 'error',
                title: data.mssg,
                text: 'Error al iniciar sesión!',
                footer: '<a href="">¿Quieres registrarte?</a>'
            });
        }
    }
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <Container fluid>
            <Row>
                <Col className='text-center'>
                    <Image style={{ width: "12rem" }} src={logoAuth}></Image>
                </Col>
            </Row>
            <Form>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control name="email" type="email" placeholder="Enter email" onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control name="pass" type="password" placeholder="Password" onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col className='text-center'>
                        <Button variant="outline-success" className='text-center d-flex align-items-center justify-content-center' type="button" style={{ borderRadius: "300rem", width: "100%", height: "3rem" }} onClick={sendUser}>
                            Iniciar Sesión  <i className='d-flex align-items-center justify-content-center m-2' style={{ fontSize: "2rem" }}> <SiWebauthn /></i>
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col className='text-center'>
                        <Button variant="link" className='text-center d-flex align-items-center justify-content-center'>¿Olvidaste tu contraseña?</Button>
                    </Col>
                </Row>
                <Row>
                    <Col className='text-center'>
                        <Button className='btn btn-primary mt-3 d-flex align-items-center justify-content-center' type="button" style={{ borderRadius: "300rem", width: "100%", height: "3rem" }} onClick={handleShow}>
                            Registrarse  <i className='d-flex align-items-center justify-content-center ' style={{ fontSize: "2rem" }}><GiChecklist /></i>
                        </Button>
                        <Offcanvas placement='end' show={show} onHide={handleClose}>
                            <Offcanvas.Header className='text-light' style={{ backgroundImage: "linear-gradient(#000046, #053884)" }}>
                                <h4><RiLoginCircleLine /></h4>
                                <Offcanvas.Title>Registro Nuevo</Offcanvas.Title>
                                <CloseButton variant="white" onClick={handleClose} />
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Register/>
                            </Offcanvas.Body>
                        </Offcanvas>
                    </Col>
                </Row>
                <Row>
                    <Col className='text-center'>
                        <Button className='btn btn-dark mt-3 d-flex align-items-center justify-content-center' type="button" style={{ borderRadius: "300rem", width: "100%", height: "3rem" }} >
                            Iniciar sesión con <Image className="m-2" src={googleSSO} style={{ width: "2rem" }}></Image>
                        </Button>
                    </Col>
                </Row>
            </Form>


        </Container>
    )
}

export default Auth