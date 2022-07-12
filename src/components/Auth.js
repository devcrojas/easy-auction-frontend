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
import ResetPasswordLogin from './ResetPasswordLogin';

import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'
import { TextField, Button as ButtonMui, Box } from '@mui/material';
import PasswordIcon from '@mui/icons-material/Password';
import { AccountCircle } from '@mui/icons-material';
import { pink } from '@mui/material/colors';

function Auth() {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorEmailMssg, setErrorEmailMssgError] = useState("");
    const [errorPasswordMssg, setErrorPasswordMssgError] = useState("");

    const [user, setUser] = useState({
        email: '',
        pass: ''
    });

    const handleKeyDown = event => {
        //console.log('User pressed: ', event.key);
        // console.log(message);
        if (event.key === 'Enter') {
          // 👇️ your logic here
            sendUser()
        }
    };

    const handleInputChange = (event) => {
        setUser({
            ...user,
            [event.target.name]: event.target.value
        })
        //Valida si se escribe un email correcto y si existia un error de validacion en el input, lo quita
        if (event.target.name === "email") {
            if (validateEmail(event.target.value) && errorEmail) {
                setErrorEmail(false);
                setErrorEmailMssgError("")
            }
        }
        //Valida si existe algo en el campo password
        if (event.target.name === "pass") {
            if (event.target.value !== "" && errorPassword) {
                setErrorPassword(false);
                setErrorPasswordMssgError("")
            }
        }
    }
    async function sendUser() {
        console.log(user);
        //Valida si los inputs vienen vacios, muestra dos errores
        if (user.email === "" && user.pass === "") {
            setErrorEmail(true);
            setErrorPassword(true);
            setErrorEmailMssgError("Se debe ingresar un correo")
            setErrorPasswordMssgError("Se debe ingresar una contraseña")
            //Valida si email es diferente de vacío y si el password es vacío
        } else if (user.email !== "" && user.pass === "") {
            setErrorPassword(true);
            setErrorPasswordMssgError("Se debe ingresar una contraseña");
            //Si el email es invalido, se muestran los errores
            if (!validateEmail(user.email)) {
                setErrorEmail(true);
                setErrorEmailMssgError("Ingrese un correo valido")
            }
            //Si el password no es vacío pero el email si, se agrega mensaje de error para email
        } else if (user.email === "" && user.pass !== "") {
            setErrorEmail(true);
            setErrorEmailMssgError("Se debe ingresar un correo");
            //Si el email y el pass son diferentes de vacíos
        }else if (user.email !== "" && user.pass !== "") {
            //Valida si el email es valido, si no entra al else y muestra error de email
            if (validateEmail(user.email)) {
                var data = await authService.login(user);
                data = await data.json();
                if (data.status !== -1) {
                    localStorage.setItem("token", data.data.token);
                    //Evita que el usuario regrese con el boton de volver al login.
                    navigate("/productos", { replace: true });
                } else {
                    localStorage.removeItem("token");
                    //console.log(data);
                    Swal.fire({
                        icon: 'error',
                        title: data.mssg,
                        text: 'Error al iniciar sesión!',
                        footer: '<a href="">¿Quieres registrarte?</a>'
                    });
                }
            }else{
                setErrorEmail(true);
                setErrorEmailMssgError("Se debe ingresar un correo")
            }

        }
    }
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
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
                            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <AccountCircle sx={{ color: (!errorEmail) ? 'action.active' : pink[500], mr: 1, my: 0.5 }} />
                                <TextField
                                    error={(errorEmail) ? true : false}
                                    type="email"
                                    id="correoSend"
                                    name="email"
                                    label="Correo"
                                    variant="standard"
                                    style={{ width: "100%" }}
                                    onChange={handleInputChange}
                                    helperText={(!errorEmail) ? "" : errorEmailMssg} 
                                    onKeyDown={handleKeyDown}/>
                            </Box>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <PasswordIcon sx={{ color: (!errorPassword) ? 'action.active' : pink[500], mr: 1, my: 0.5 }} />
                                <TextField
                                    error={(errorPassword) ? true : false}
                                    type="password"
                                    id="passwordSend"
                                    name="pass"
                                    label="Password"
                                    variant="standard"
                                    style={{ width: "100%" }}
                                    onChange={handleInputChange}
                                    helperText={(!errorPassword) ? "" : errorPasswordMssg}
                                    onKeyDown={handleKeyDown} />
                            </Box>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col className='text-center'>
                        <ButtonMui variant="contained" color="success" className='text-center d-flex align-items-center justify-content-center' type="button" style={{ borderRadius: "300rem", width: "100%", height: "3rem" }} onClick={sendUser}>
                            Iniciar Sesión  <i className='d-flex align-items-center justify-content-center m-2' style={{ fontSize: "2rem" }}> <SiWebauthn /></i>
                        </ButtonMui>
                    </Col>
                </Row>
                <Row>
                    <Col className='text-center'>
                        <Button variant="link" className='' onClick={handleShow2}>
                            ¿Olvidaste tu contraseña?
                        </Button>
                        <Offcanvas placement='end' show={show2} onHide={handleClose2}>
                            <Offcanvas.Header className='text-light' style={{ backgroundImage: "linear-gradient(#000046, #053884)" }}>
                                <h4><RiLoginCircleLine /></h4>
                                <Offcanvas.Title>Reinicio de password</Offcanvas.Title>
                                <CloseButton variant="white" onClick={handleClose2} />
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <ResetPasswordLogin></ResetPasswordLogin>
                            </Offcanvas.Body>
                        </Offcanvas>
                    </Col>
                </Row>
                <Row>
                    <Col className='text-center'>
                        <ButtonMui className='mt-3 d-flex align-items-center justify-content-center' type="button" variant="contained" color="primary" style={{ borderRadius: "300rem", width: "100%", height: "3rem" }} onClick={handleShow}>
                            Registrarse  <i className='d-flex align-items-center justify-content-center ' style={{ fontSize: "2rem" }}><GiChecklist /></i>
                        </ButtonMui>
                        <Offcanvas placement='end' show={show} onHide={handleClose}>
                            <Offcanvas.Header className='text-light' style={{ backgroundImage: "linear-gradient(#000046, #053884)" }}>
                                <h4><RiLoginCircleLine /></h4>
                                <Offcanvas.Title>Registro Nuevo</Offcanvas.Title>
                                <CloseButton variant="white" onClick={handleClose} />
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Register />
                            </Offcanvas.Body>
                        </Offcanvas>
                    </Col>
                </Row>
                <Row>
                    <Col className='text-center'>
                        <ButtonMui className='mt-3 d-flex align-items-center justify-content-center' type="button" variant="outlined" style={{ borderRadius: "300rem", width: "100%", height: "3rem" }} >
                            Iniciar sesión con <Image className="m-2" src={googleSSO} style={{ width: "2rem" }}></Image>
                        </ButtonMui>
                    </Col>
                </Row>
            </Form>


        </Container>
    )
}

export default Auth