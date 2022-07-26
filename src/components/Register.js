import { React, useEffect, useState } from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import logoAuth from '../images/EasyAuction.gif'
import { SiWebauthn } from 'react-icons/si';

import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'
import { Button, TextField } from '@mui/material';

function Register() {
    const [data, setData] = useState({
        name: '',
        firstName: '',
        email: '',
        password: '',
        password2: ''
    });
    const [dis, setDis] = useState(true);
    const [errorEmail, setErrorEmail] = useState(false)
    const [errorEmailText, setErrorEmailText] = useState("")
    const [errorPass, setErrorPass] = useState(false)
    const [errorPassText, setErrorPassText] = useState("")
    const handleInputChange = (event) => {

        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }
    useEffect(() => {
        if (data.email !== '') {
            if (validateEmail(data.email) === null) {
                setErrorEmail(true);
                setErrorEmailText("introduce un correo valido como: \n easyauction@gmail.com");
            } else {
                setErrorEmail(false);
                setErrorEmailText("");
            }

        } else {
            setErrorEmail(false);
            setErrorEmailText("");
        }
        if (data.password !== '' && data.password2 !== '') {
            if (data.password === data.password2) {
                setErrorPass(true);
                setErrorPassText("");
            } else {
                setErrorPass(false)
                setErrorPassText("Las contraseñas no coinciden");
            }
        } else {
            setErrorPass(true);
            setErrorPassText("");
        }
        if (data.name !== '' && data.firstName !== '' && data.email !== '' && data.password !== '' && data.password2 !== '' && validateEmail(data.email) !== null) {
            setDis(false);
        } else {
            setDis(true);
        }
    }, [data]);
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
    function sendRegister() {
        if (errorPass === false) {
            Swal.fire({
                icon: 'error',
                title: 'Password Invalida',
                text: 'Revisa que tu contraseña sea correcta',
                footer: 'Lamentamos los incovenientes.'
            });
        } else {
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
            <Row>
                <Col>
                    <TextField id="Nombre" label="Nombre" variant="standard" name="name" type="text" onChange={handleInputChange} required inputProps={{ maxLength: "30" }} margin="normal" fullWidth />
                </Col>
            </Row>
            <Row>
                <Col>
                    <TextField id="Apellidos" label="Apellidos" variant="standard" name="firstName" type="text" onChange={handleInputChange} required inputProps={{ maxLength: "30" }} margin="normal" fullWidth />
                </Col>
            </Row>
            <Row>
                <Col>
                    <TextField id="Email" label="Email" variant="standard"
                        name="email" type="email" onChange={handleInputChange}
                        required inputProps={{ maxLength: "50" }} margin="normal"
                        fullWidth
                        error={errorEmail}
                        helperText={errorEmailText} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <TextField id="Contraseña" label="Contraseña" variant="standard"
                        name="password" type="password" onChange={handleInputChange}
                        required inputProps={{ maxLength: "16", minLength: "8" }}
                        margin="normal" fullWidth
                        error={(errorPass) ? false : true}
                        helperText={errorPassText} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <TextField id="confirmarContraseña" label="Confirmar Contraseña"
                        variant="standard" name="password2" type="password"
                        onChange={handleInputChange} required
                        inputProps={{ maxLength: "16", minLength: "8" }} margin="normal" fullWidth
                        error={(errorPass) ? false : true}
                        helperText={errorPassText} />
                </Col>
            </Row>
            <Row>
                <Col className='text-center'>
                    <Button variant="contained" color="success" className='text-center align-items-center justify-content-center' type="button"
                        style={{ borderRadius: "300rem", width: "100%", height: "3rem" }}
                        onClick={sendRegister} margin="normal" disabled={dis}>
                        Registrate  <i className='d-flex align-items-center justify-content-center m-2' style={{ fontSize: "2rem" }}> <SiWebauthn /></i>
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}

export default Register