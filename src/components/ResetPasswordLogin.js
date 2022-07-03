import React, { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { TextField, Button as ButtonMui, Box, FormControl, CircularProgress } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import authService from '../services/auth.service'

function ResetPasswordLogin(params) {
    const [data, setData] = useState({
        correoSend: ''
    });
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorEmailMssg, setErrorEmailMssgError] = useState("");
    const [hostSend, setHostSend] = useState(window.location.protocol + "//" + window.location.host);


    const [loadButton, setLoadButton] = useState(false)
    const handleInputChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
        if (event.target.name === "correoSend") {
            if (validateEmail(event.target.value)) {
                setErrorEmail(false);
                setErrorEmailMssgError("");
            }
        }
    }

    const sendEmail = async (event) => {
        if (validateEmail(data.correoSend)) {
            setLoadButton(true);
            //Se busca en la BD
            //console.log(data)
            let validateExist = await authService.getUserByEmail({ correoSend: data.correoSend });
            //console.log(validateExist);
            if (validateExist.status === 1) {
                // code fragment
                var dataRequest = {
                    service_id: 'service_gpmmxif',
                    template_id: 'template_r7geg85',
                    user_id: 'pjGIe-rHJdzDi-_ug',
                    template_params: {
                        'to_email': validateExist.user[0].email,
                        'to_name': validateExist.user[0].name,
                        'from_name': 'Easy Auction System',
                        'jw_token': validateExist.data.token,
                        'host_send': hostSend
                    }
                };
                var sendEmail = new Promise(async (resolve, reject) => {
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dataRequest)
                    };
                    var sendEmail = await fetch("https://api.emailjs.com/api/v1.0/email/send", requestOptions);
                    resolve(sendEmail);
                });
                var result = await sendEmail;
                if(result.ok){
                    setLoadButton(false);
                    setData({
                        "correoSend": ""
                    });
                    Swal.fire({
                        icon: 'success',
                        title: "El correo se envió exitosamente",
                        text: 'Correo Enviado!',
                        footer: '<a href="#">Revisa tu correo!</a>',
                    });
                }else{
                    setLoadButton(false);
                    Swal.fire({
                        icon: 'error',
                        title: "Error!!",
                        text: 'Error al envíar correo!',
                        footer: '<a href="#">Comunicate con el Administrador</a>'
                    });
                }
            } else {
                setLoadButton(false);
                Swal.fire({
                    icon: 'error',
                    title: "Error!!",
                    text: 'Dirección de correo desconocida.',
                    footer: '<a href="#">Verifique su cuenta</a>'
                });
            }
        } else {
            setErrorEmail(true);
            setErrorEmailMssgError("Ingrese un correo valido");
        }
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
    return (
        <>
            <Row>
                <FormControl>
                    <Col className='text-center'>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <TextField
                                type="email"
                                id="correoSend"
                                name="correoSend"
                                label="Correo"
                                variant="standard"
                                style={{ width: "100%" }}
                                value={data.correoSend}
                                onChange={handleInputChange}
                                helperText={(!errorEmail) ? "" : errorEmailMssg}
                                error={(errorEmail) ? true : false} />
                        </Box>
                        <br></br>
                        <ButtonMui
                            variant="contained"
                            disabled={loadButton}
                            endIcon={(loadButton) ? <CircularProgress size={25} color="inherit" /> : <SendIcon />}
                            onClick={sendEmail} >
                            {(loadButton) ? "Enviando ..." : "Enviar"}
                        </ButtonMui>
                    </Col>
                </FormControl>
            </Row>
        </>

    )
}

export default ResetPasswordLogin