import { React, useEffect, useState } from 'react'
import { Button, Container, Form, Row, Col, Image } from 'react-bootstrap'
import logoAuth from '../images/EasyAuction.gif'
import { SiWebauthn } from 'react-icons/si';


import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'

function Register() {
    const [data, setData] = useState({
        name: '',
        firstName: '',
        email: '',
        password: ''
    });
    const [dis, setDis] = useState(true);
    const handleInputChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }
    useEffect(() => {
        if (data.name !== '' && data.firstName !== '' && data.email !== '' && data.password !== '') {
            setDis(false);
        } else {
            setDis(true);
        }
    }, [data]);
    function sendRegister() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        fetch("/api/user/register", requestOptions)
            .then((res) => res.json())
            .then((data) => {
                if (data._id !== '') {
                    sendProfile();
                    Swal.fire({
                        icon: 'success',
                        title: "Usuario registrado",
                        text: `Bienvenido(a): ${data.name}`,
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: data.mssg,
                        text: 'Error al iniciar sesión!',
                        footer: '<a href="">¿Quieres registrarte?</a>'
                    });
                }
            })
            .catch(error => { console.error("Error", error.message) });

    }
    function sendProfile() {
        let profile = {
            "_id": data.email,
            "firstName": data.name,
            "lastName": data.firstName,
            "birthday": "",
            "address": {
                "cpp": "",
                "street": "",
                "suburb": "",
                "municipaly": "",
                "state": "",
            },
            "phone": "",
            "email": data.email,
            "password": "",
            "status": "true"
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile)
        };
        fetch("/api/profiles/", requestOptions)
            .then((res) => res.json())
            .then((data) => {
                if (data._id !== '') {
                    console.log("se creo el perfil")
                }
            })
            .catch(error => { console.error("Error in Profile", error.message) });

    }
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
                        <Form.Group className="mb-3" controlId="forName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control name="name" type="text" placeholder="Nombre" onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="forFirstName">
                            <Form.Label>Apellidos</Form.Label>
                            <Form.Control name="firstName" type="text" placeholder="Apellidos" onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                </Row>
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
                            <Form.Control name="password" type="password" placeholder="Password" onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col className='text-center'>
                        <Button variant="outline-success" className='text-center d-flex align-items-center justify-content-center' type="button"
                            style={{ borderRadius: "300rem", width: "100%", height: "3rem" }}
                            onClick={sendRegister} disabled={dis}>
                            Registrate  <i className='d-flex align-items-center justify-content-center m-2' style={{ fontSize: "2rem" }}> <SiWebauthn /></i>
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}

export default Register