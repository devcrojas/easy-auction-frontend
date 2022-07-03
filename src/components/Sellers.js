import React, { useState, useRef } from 'react'
import { Form, Container, Col, Row, Card } from 'react-bootstrap'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'
import axios from 'axios';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Backdrop, Box, Modal, Fade } from '@mui/material';
//import AuthService from '../services/auth.service'

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

function Sellers() {

     // Variables para abrir y cerrar el modal
     const [showModalBonito, setShowModalBonito] = useState(false);
     const handleClose = () => setShowModalBonito(false);
     //Variable para los caracteres restantes en observaciones
     const [caracRestantes, setcaracRestantes] = useState(0);
     //Variables para el formulario
     const [firstNameSeller, setFirstNameSeller] = useState('');
     const [lastNameSeller, setLastNameSeller] = useState('');
     const [birthday, setBirthday] = useState('');
     const [cpp, setCpp] = useState('');
     const [street, setStreet] = useState('');
     const [suburb, setSuburb] = useState('');
     const [municipaly, setMunicipaly] = useState('');
     const [state, setState] = useState('');
     const [phone, setPhone] = useState('');
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [file, setFile] = useState('');
     //Referencias de imagenes
     let fileRef = useRef(null);
     // Se obtiene el usuario de sesion
     /* let user = AuthService.getCurrentUser(); */
     //Contador para los inputs de tipo file modalStyle
 
     const prepareData = (e) => {
         e.preventDefault();
 
         let formData = new FormData();
         
         // Se manda la imagen principal
         formData.append("file", file[0])
         // Se mandan los demas atributos del producto
         formData.append("firstNameSeller", firstNameSeller)
         formData.append("lastNameSeller", lastNameSeller)
         formData.append("birthday", birthday)
         formData.append("cpp", cpp)
         formData.append("street", street)
         formData.append("suburb", suburb)
         formData.append("municipaly", municipaly)
         formData.append("state", state)
         formData.append("phone", phone)
         formData.append("email", email)
         formData.append("password", password)
         // Se mandan los datos del status y usuario
         formData.append("status", 'Active')
         //formData.append("email", user.id)
         // Se manda a realizar la peticion
         sendData(formData)
     }
 
     const sendData = async (formData) => {
         // Se realiza la peticion al back
         let resp = await axios.post('http://localhost:8080/sellers', formData);
         // Se obtiene el status de la respuesta
         if(resp.status === 201){
             Swal.fire({
                 icon: 'success',
                 title: '¡Ya es vendedor!',
                 text: 'Se ha registrado satisfactoriamente!',
             })
         }else{
             Swal.fire({
                 icon: 'error',
                 title: 'Error: '+resp.status,
                 text: resp.statusText,
             })
         }
     }
 
     //Funcion para validar si el boton se bloquea o no
     const validateButton = () => {
         if(firstNameSeller  === '' || lastNameSeller   === '' || birthday === '' || 
            cpp        === '' || street === '' || suburb === '' || 
            municipaly === '' || state     === '' || phone === '' || 
            email    === '' || password === ''){
             return true;
         }else{
             return false;
         }
     }
 
     const imageValidator = async (file, reference, setter) => {
         //console.log('user',user);
         //valida que sean 5 o menos
         if(file.length <= 5){
             // Recorre los files
             for (let i = 0; i < file.length; i++) {
                 //Valida que sea una imagen
                 if(file[i].type === 'image/png' || file[i].type === 'image/jpeg'){
                     //Le da su valor
                     await setter(file)
                 }else{
                     await setter('')
                     reference.current.value = '';
                     Swal.fire({
                         icon: 'error',
                         title: '¡No es una imagen!',
                         text: 'Por favor solo suba archivos PNG y JPEG/JPG'
                     });
                 }
             }
         } else {
             await setter('')
             reference.current.value = '';
             Swal.fire({
                 icon: 'error',
                 title: '¡Son mas de 5!',
                 text: 'Por favor suba solo 5 imagenes o menos'
             });
         }
     }


    return (
        <Container>
            <Row>
                <Col>
                    <Card className='mt-5'>
                        <Card.Body>
                            <Card.Title>¿Quieres vender?</Card.Title>
                            <Card.Text>
                                No pierdas tiempo y realiza una subasta registrate!
                            </Card.Text>
                            <Button variant="contained" color="primary" onClick={() => setShowModalBonito(true)}>
                                Registrarse
                            </Button>
                        </Card.Body>                            
                    </Card>
                    <Modal  aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            open={showModalBonito}
                            onClose={handleClose}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{ timeout: 500, }}>
                        <Fade in={showModalBonito}>
                            <Box sx={modalStyle} className='overflow-auto prettyScroll'>
                                <Container>
                                    <Form onSubmit={prepareData} encType='multipart/form-data'>
                                        <Row>
                                            <Col xs={12}>
                                                <div className="border-bottom">
                                                    <div><h4>Registrarse</h4></div>
                                                    <div><h6>Los campos con <strong className='text-danger'>*</strong> son obligatorios</h6></div>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xs={12} sm={6}>
                                                <FormControl className='w-100 my-2'>
                                                    <TextField required id="outlined-required" label="Nombres" onChange={(event) => setFirstNameSeller(event.target.value)} placeholder="Nombre"/>
                                                </FormControl>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <FormControl className='w-100 my-2'>
                                                    <TextField required id="outlined-required" label="Apellidos" onChange={(event) => setLastNameSeller(event.target.value)} placeholder="Apellidos"/>
                                                </FormControl>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xs={12} sm={12} md={4}>
                                                <FormControl className='w-100 my-2'>
                                                    <TextField required label="Fecha de cumpleaños" data-date-inline-picker="true" type="datetime-local" onChange={(event) => setBirthday(event.target.value)} InputLabelProps={{shrink: true}}/>
                                                </FormControl>
                                            </Col>
                                            <Col xs={12} sm={6} md={4}>
                                                <FormControl className='w-100 my-2'>
                                                    <TextField required id="outlined-required" label="Codigo postal" onChange={(event) => setCpp(event.target.value)} placeholder="Codigo postal"/>
                                                </FormControl>
                                            </Col>
                                            <Col xs={12} sm={6} md={4}>
                                                <FormControl className='w-100 my-2'>
                                                    <TextField required id="outlined-required" label="Calle y numero" onChange={(event) => setStreet(event.target.value)} placeholder="Calle"/>
                                                </FormControl>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xs={12} sm={6} md={4}>
                                                <FormControl className='w-100 my-2'>
                                                    <TextField required id="outlined-required" label="Suburbio" onChange={(event) => setSuburb(event.target.value)} placeholder="Suburbio"/>
                                                </FormControl>
                                            </Col>
                                            <Col xs={12} sm={6} md={4}>
                                                <FormControl className='w-100 my-2'>
                                                    <TextField required id="outlined-required" label="Municipio" onChange={(event) => setMunicipaly(event.target.value)} placeholder="Municipio"/>
                                                </FormControl>
                                            </Col>
                                            <Col xs={12} sm={6} md={4}>
                                                <FormControl className='w-100 my-2'>
                                                    <TextField required id="outlined-required" label="Estado" onChange={(event) => setState(event.target.value)} placeholder="Estado"/>
                                                </FormControl>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xs={12} sm={12} md={4}>
                                                <FormControl className='w-100 my-2'>
                                                    <TextField required id="outlined-required" label="Telefono" onChange={(event) => setPhone(event.target.value)} placeholder="Telefono"/>
                                                </FormControl>
                                            </Col>
                                            <Col xs={12} sm={6} md={4}>
                                                <FormControl className='w-100 my-2'>
                                                    <TextField required id="outlined-required" label="Correo electronico" onChange={(event) => setEmail(event.target.value)} placeholder="Correo electronico"/>
                                                </FormControl>
                                            </Col>
                                            <Col xs={12} sm={6} md={4}>
                                                <FormControl className='w-100 my-2'>
                                                    <TextField required id="outlined-required" label="Contraseña" onChange={(event) => setPassword(event.target.value)} placeholder="Contraseña"/>
                                                </FormControl>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xs={12} lg={6}>
                                                <div className='w-100 my-2'>
                                                    <h6>Foto de perfil <strong className='text-danger'>*</strong></h6>
                                                    <Form.Control  type="file" accept="image/png,image/jpeg" className="form-control" ref={fileRef} onChange= {(e) => imageValidator(e.target.files, fileRef, setFile)}/>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                            </Col>
                                        </Row>
                                        <Row className='mt-3'>
                                            <Col className='d-flex justify-content-center'>
                                                <Button disabled={ validateButton() } type='submit' block="true" className='w-50' variant="contained" color="success">
                                                    Registrarse
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Container>
                            </Box>
                        </Fade>
                    </Modal>
                </Col>
            </Row>
        </Container>
    )
}

export default Sellers;