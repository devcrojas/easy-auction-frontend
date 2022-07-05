import { useEffect, useState } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import SendIcon from '@mui/icons-material/Send';

import Swal from 'sweetalert2/dist/sweetalert2.js'
import jwt_decode from "jwt-decode";
import userService from '../services/user.service';
import {
    useParams,
    useNavigate
} from "react-router-dom";

import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { pink } from '@mui/material/colors';
import PasswordIcon from '@mui/icons-material/Password';
import KeyIcon from '@mui/icons-material/Key';
import { TextField} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

function ResetPasswordLogin() {
    const navigate = useNavigate();

    const [data, setData] = useState({
        password: '',
        passwordConfirm: ''
    });
    const [validateJWToken, setValidateJWToken] = useState(true);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorPasswordMssg, setErrorPasswordMssgError] = useState("");
    const [errorPassword2, setErrorPassword2] = useState(false);
    const [errorPasswordMssg2, setErrorPasswordMssgError2] = useState("");
    const [userRequest, setUserRequest] = useState({});
    let { jwtoken } = useParams();

    useEffect(() => {
        try {
            //Validate JWTOKEN Valid
            //Validate Timestamp JWTOKEN < 30 min.
            const dataJWT = jwt_decode(jwtoken);
            setUserRequest(dataJWT);
            let dateJWTExpire = new Date(dataJWT.date);
            let now = new Date();
            dateJWTExpire.setMinutes(dateJWTExpire.getMinutes() + 30)
            //console.log(dateJWTExpire);
            //console.log(now);
            //console.log(now < dateJWTExpire);
            if (now < dateJWTExpire) {
                //console.log("Reset Valido en Fecha");
                //Validate Token BD And Redirect or Acces To Reset Password
                let getToken = async () => {
                    let getToken2 = await userService.validateToken({ JWToken: jwtoken });
                    //console.log(getToken2);
                    if(getToken2.status === 1){
                        if (dataJWT.date === getToken2.token.timestamp) {
                            setValidateJWToken(true);
                            //console.log(dataJWT);
                        } else {
                            setValidateJWToken(false);
                            //console.log("JWToken Alterado ! -> Error de alteración en Fecha");
                            Swal.fire({
                                icon: 'error',
                                title: "Error de Inyección de Código",
                                text: 'El Token fue alterado en su atributo de fechas',
                                footer: 'Sentimos mucho los incovenientes.',
    
                            });
                            navigate("/");
                        }
                    }else{
                        setValidateJWToken(false);
                            //console.log("JWToken Alterado ! -> Error de alteración en Fecha");
                            Swal.fire({
                                icon: 'error',
                                title: "Error de Expriación",
                                text: 'El Token expiro, vuelva a solicitar su reinicio de password.',
                                footer: 'Sentimos mucho los incovenientes.',
            
                            });
                            navigate("/");
                    }
                    
                };
                getToken();
            } else {
                setValidateJWToken(false);
                Swal.fire({
                    icon: 'error',
                    title: "Error de Expriación",
                    text: 'El Token expiro, vuelva a solicitar su reinicio de password.',
                    footer: 'Sentimos mucho los incovenientes.',

                });
                navigate("/");
                //console.log("Token Caduco");
            }
        } catch (e) {
            setValidateJWToken(false);
            Swal.fire({
                icon: 'error',
                title: "Error Inesperado",
                text: e.message,
                footer: 'Sentimos mucho los incovenientes.',

            });
            navigate("/");
            //console.log(e.message);
        }

    }, [jwtoken, setValidateJWToken, navigate]);

    const handleInputChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
        if(event.target.name === "password" && event.target.value !== ""){
            setErrorPassword(false);
            setErrorPasswordMssgError("");
        }else
        if(event.target.name === "passwordConfirm" && event.target.value !== ""){
            setErrorPassword2(false);
            setErrorPasswordMssgError2("");
        }

        if(event.target.name === "passwordConfirm" && event.target.value !== "" && event.target.value === data.password ){
            setErrorPassword(false);
            setErrorPasswordMssgError("");
            setErrorPassword2(false);
            setErrorPasswordMssgError2("");
        }else if(event.target.name === "password" && event.target.value !== "" && event.target.value === data.passwordConfirm ){
            setErrorPassword(false);
            setErrorPasswordMssgError("");
            setErrorPassword2(false);
            setErrorPasswordMssgError2("");
        }
    }

    const confirm = (event)=> {
        if(data.password === data.passwordConfirm && data.passwordConfirm !== ""){
            //Cambio a la BD. Validar preguntando el correo.
            let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;
            if(reg.test(data.password)){
                //console.log("Cambio aceptado");
                Swal.fire({
                    title: 'Confirma tu correo!',
                    input: 'text',
                    icon: 'question',
                    showLoaderOnConfirm: true,
                    customClass: {
                      validationMessage: 'my-validation-message'
                    },
                    preConfirm: (value) => {
                      if (!value) {
                        Swal.showValidationMessage(
                          '<i class="fa fa-info-circle"></i> Tu Correo es obligatorio.'
                        )
                      }else{
                        if(value === userRequest.email){
                            return true;
                        }else{
                            Swal.showValidationMessage(
                                '<i class="fa fa-info-circle"></i> Tu Correo no coincide.'
                              )
                            return false;

                        }
                      }
                    }
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                        //console.log("Realizar cambio de password");
                        //console.log(userRequest);
                        let paramsApply = {
                            date: userRequest.date,
                            id: userRequest.id,
                            email: userRequest.email,
                            JWToken: jwtoken,
                            password: data.password
                        };
                        let apply = await userService.applyResetPassword(paramsApply);
                        //console.log(apply);
                        navigate("/");
                        if(apply.status === 1){
                            Swal.fire({
                                icon: "success",
                                title: `Cambio exitoso de contraseña!`,
                            });
                        }else{
                            Swal.fire({
                                icon: "error",
                                title: `${apply.mssg}`,
                            });
                        }                        
                    }
                  })
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Password Invalida',
                    text: 'Por tu seguridad tu contraseña deberá contener almenos una letra minúscula y mayúscula, un carácter especial (@#$%^&+=) y 8 o más carácteres.',
                    footer: 'Lamentamos los incovenientes.'
                });
            }
            //console.log(reg.test(data.password));

        }else if(data.passwordConfirm === "" && data.password === ""){
            setErrorPassword(true);
            setErrorPasswordMssgError("La contraseña no debe estar vacía");
            setErrorPassword2(true);
            setErrorPasswordMssgError2("La contraseña no debe estar vacía");
        }else if(data.passwordConfirm !== "" && data.password === ""){
            setErrorPassword(true);
            setErrorPasswordMssgError("La contraseña no debe estar vacía");
        }else{
            setErrorPassword2(true);
            setErrorPasswordMssgError2("Las contraseñas deben coincidir");
        }
    }

    return (
        <>
            {(validateJWToken) ?
                <Container fluid>
                    <Row className='home-row'>
                        <Col md='12' className='div-welcome d-flex flex-column align-items-center justify-content-center'>
                            <Box sx={{ minWidth: 350, maxWidth: 350}}>
                                <Card variant="outlined">
                                    <React.Fragment>
                                        <CardContent>
                                            <h5>
                                                <KeyIcon></KeyIcon>
                                                 {" Reinicio de Password"}
                                            </h5>
                                            <hr></hr>
                                            <span sx={{ mb: 1.5 }} color="text.secondary">
                                                <AccountCircle></AccountCircle>
                                                {" " + userRequest.name}
                                            </span>
                                            <span>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                                    <PasswordIcon sx={{ color: (!errorPassword) ? 'action.active' : pink[500], mr: 1, my: 0.5 }} />
                                                    <TextField
                                                        error={(errorPassword) ? true : false}
                                                        type="password"
                                                        id="passwordSend"
                                                        name="password"
                                                        label="Password"
                                                        variant="standard"
                                                        style={{ width: "100%" }}
                                                        onChange={handleInputChange}
                                                        helperText={(!errorPassword) ? "" : errorPasswordMssg}
                                                    />
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                                    <PasswordIcon sx={{ color: (!errorPassword2) ? 'action.active' : pink[500], mr: 1, my: 0.5 }} />
                                                    <TextField
                                                        error={(errorPassword2) ? true : false}
                                                        type="password"
                                                        id="passwordConfirm"
                                                        name="passwordConfirm"
                                                        label="Confirmar Password"
                                                        variant="standard"
                                                        style={{ width: "100%" }}
                                                        onChange={handleInputChange}
                                                        helperText={(!errorPassword2) ? "" : errorPasswordMssg2}
                                                    />
                                                </Box>
                                            </span>
                                            <Stack sx={{ width: '100%' }} spacing={2} className="mt-3">
                                                <Alert severity="warning">Por tu seguridad tu contraseña deberá contener almenos una letra minúscula y mayúscula, un carácter especial (@#$%^&+=) y 8 o más carácteres.</Alert>
                                            </Stack>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" onClick={confirm}><SendIcon style={{marginRight: ".5rem"}}></SendIcon>Confirmar</Button>
                                        </CardActions>
                                    </React.Fragment>
                                </Card>
                            </Box>
                        </Col>
                    </Row>
                </Container>
                :
                "<p>ERROR!</p>"}
        </>

    )
}

export default ResetPasswordLogin