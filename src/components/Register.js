import { React, useEffect, useState } from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import logoAuth from '../images/EasyAuction.gif'
import { SiWebauthn } from 'react-icons/si';

import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'
import { Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';

function Register() {
    const [data, setData] = useState({
        conditions: false,
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
        if (event.target.name === 'conditions') {
            setData({
                ...data,
                [event.target.name]: event.target.checked
            });
        } else {
            setData({
                ...data,
                [event.target.name]: event.target.value
            });
        }
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
        if (data.name !== '' && data.firstName !== '' && data.email !== '' && data.password !== '' && data.password2 !== '' && validateEmail(data.email) !== null && data.conditions === true) {
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
    async function validarEmailRegistrado() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        let resp = await fetch(`/api/profiles/${data.email}`, requestOptions);
        let response = await resp.json();
        if (response.status === -1) {
            sendRegister();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'El correo ya existe!',
                text: 'Introduce otro correo'
            });
        }
    }
    async function sendRegister() {
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
            let resp = await fetch("/api/user/register", requestOptions);
            if (resp.status === 200) {
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
                    text: 'Error al registrarse!'
                });
            }
        }
    }
    async function sendProfile() {
        let profile = {
            "_id": data.email,
            "firstName": data.name,
            "lastName": data.firstName,
            "birthday": "",
            "address": {
                "cp": "",
                "street": "",
                "suburb": "",
                "municipality": "",
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
        let resp = await fetch("/api/profiles/", requestOptions);
        if (resp.status === 201) {
            resp.json();
        } else {
            console.error("Error in Profile", resp)
        }
    }
    const conditions = () => {
        return (
            <Typography variant="caption"><a href="/info" target="_blank" >Acepto terminos y condiciones</a></Typography>
        )
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
                        helperText={(errorPass === true) ? "8 caracteres como máximo" : errorPassText} />
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
            <Row className="d-flex justify-content-center">
                <FormControlLabel className="my-2"
                    control={
                        <Checkbox onChange={handleInputChange} name="conditions" />
                    }
                    label={conditions()}
                />
            </Row>
            <Row>
                <Col className='text-center'>
                    <Button variant="contained" color="success" className='text-center align-items-center justify-content-center' type="button"
                        style={{ borderRadius: "300rem", width: "100%", height: "3rem" }}
                        onClick={validarEmailRegistrado} margin="normal" disabled={dis}>
                        Registrate  <i className='d-flex align-items-center justify-content-center m-2' style={{ fontSize: "2rem" }}> <SiWebauthn /></i>
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}

export default Register