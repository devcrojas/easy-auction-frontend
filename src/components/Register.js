import { React, useState } from 'react'
import { Button, Card, Container, Form, Row } from 'react-bootstrap'

function Register() {
    const [data, setData] = useState({
        name: '',
        firstName: '',
        email: '',
        password: ''
    });
    const handleInputChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }
    function sendRegister() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        fetch("/user/register", requestOptions)
            .then((res) => res.json())
            .then((data) => alert("Usuario registrado " + data.name));

    }
    return (
        <Container fluid>
            <Row className="d-flex justify-content-center align-items-center">
                <Card style={{ width: '25%', padding: "0" }} className="m-3">
                    <Card.Header className='text-center bg-dark text-white' style={{width: "100%"}}>Registrate</Card.Header>
                    <Card.Body>
                        <Form className='text-center'>
                            <Form.Group className="mb-3" controlId="formRegisterName">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control name="name" type="text" placeholder="Nombre" onChange={handleInputChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formRegisterFName">
                                <Form.Label>Apellidos</Form.Label>
                                <Form.Control name="firstName" type="text" placeholder="Apellidos" onChange={handleInputChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control name="email" type="email" placeholder="Enter email" onChange={handleInputChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formRegisterPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control name="password" type="password" placeholder="Password" onChange={handleInputChange} />
                            </Form.Group>
                            <Button variant="primary" type="button" className='btn btn-success text-center' onClick={sendRegister}>
                                Registrarse
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Row>
        </Container>
    )
}

export default Register