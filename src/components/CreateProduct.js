import React, { useState, useRef } from 'react'
import { Form, Container, Col, Row } from 'react-bootstrap'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'
import axios from 'axios';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const CreateProduct = (props) => {

    //Variable para los caracteres restantes en observaciones
    const [caracRestantes, setcaracRestantes] = useState(0);
    //Variables para el formulario
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [material, setMaterial] = useState('');
    const [marca, setMarca] = useState('');
    const [dimensions, setDimensions] = useState('');
    const [conditions, setConditions] = useState('');
    const [observations, setObservations] = useState('');
    const [buyNow, setBuyNow] = useState('');
    const [initialPrice, setInitialPrice] = useState('');
    const [closeDate, setCloseDate] = useState('');
    const [images, setImages] = useState('');
    //Referencias de imagenes
    let imgRef = useRef(null);
    //Contador para los inputs de tipo file

    const prepareData = (e) => {
        e.preventDefault();

        let formData = new FormData();
        const actualDate = new Date();
        const finalDate = new Date(closeDate)

        // Se mandan las imagenes
        for (let i = 0; i < images.length; i++) {
            formData.append('files', images[i]);                      
        }
        // Se mandan los demas atributos
        formData.append("nameProduct", productName)
        formData.append("category", category)
        formData.append("material", material)
        formData.append("marca", marca)
        formData.append("dimensions", dimensions)
        formData.append("actualCondition", conditions)
        formData.append("observations", observations)
        formData.append("initialP", initialPrice)
        formData.append("buyNow", buyNow)
        formData.append("initialD", actualDate)
        formData.append("final", finalDate)
        // Se manda a realizar la peticion
        sendData(formData)
    }

    const sendData = async (formData) => {
        // Se realiza la peticion al back
        let resp = await axios.post('http://localhost:8080/products', formData);
        // Se obtiene el status de la respuesta
        if(resp.status === 201){
            props.modal(false);
            Swal.fire({
                icon: 'success',
                title: '¡Ah empezado una nueva subasta!',
                text: 'Ah solicitado correctamente la subasta, en unos momentos dara comienzo!',
            })
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Error: '+resp.status,
                text: resp.statusText,
            })
        }
    }

    //Funcion para validar si el boton se lo bloquea o no
    const validateButton = () => {
        if(productName === '' || category === '' || material === '' || marca === '' || dimensions === '' || conditions === '' || observations === '' || buyNow === '' || initialPrice === '' || closeDate === '' || images === ''){
            return true;
        }else{
            return false;
        }
    }

    const imageValidator = async (file, reference) => {
        //valida que sean 6 o menos
        if(file.length <= 6){
            // Recorre los files
            for (let i = 0; i < file.length; i++) {
                //Valida que sea una imagen
                if(file[i].type === 'image/png' || file[i].type === 'image/jpeg'){
                    //Le da su valor
                    await setImages(file)
                }else{
                    await setImages('')
                    reference.current.value = '';
                    Swal.fire({
                        icon: 'error',
                        title: '¡Un archivo no es una imagen!',
                        text: 'Por favor solo suba archivos PNG y JPEG'
                    });
                }
            }
        } else {
            await setImages('')
            reference.current.value = '';
            Swal.fire({
                icon: 'error',
                title: '¡Son mas de 6!',
                text: 'Por favor suba solo 6 imagenes o menos'
            });
        }
    }


return (
    <Container>
        <Form className="createForm" onSubmit={prepareData} encType='multipart/form-data'>
            <Row>
                <Col>
                    <FormControl sx={{ m: 1, minWidth: 300 }}>
                        <TextField required id="outlined-required" label="Nombre del producto" onChange={(event) => setProductName(event.target.value)} placeholder="Nombre"/>
                    </FormControl>
                </Col>
                <Col>
                    <FormControl sx={{ m: 1, minWidth: 300 }}>
                        <InputLabel id="categoryLabel">Categoria *</InputLabel>
                        <Select labelId="categoryLabel" required label="Categoria *" onChange={(event) => setCategory(event.target.value)} >
                            <MenuItem value=""> <em>Seleccione una</em> </MenuItem>
                            <MenuItem value={'Ropa'}>Ropa</MenuItem>
                            <MenuItem value={'Tecnologia'}>Tecnologia</MenuItem>
                            <MenuItem value={'Artes'}>Artes</MenuItem>
                            <MenuItem value={'Libros'}>Libros</MenuItem>
                            <MenuItem value={'Joyeria'}>Joyeria</MenuItem>
                            <MenuItem value={'Instrumentos musicales'}>Instrumentos musicales</MenuItem>
                            <MenuItem value={'Videojuegos'}>Videojuegos</MenuItem>
                            <MenuItem value={'Comics'}>Comics</MenuItem>
                            <MenuItem value={'Juguetes'}>Juguetes</MenuItem>
                        </Select>
                    </FormControl>
                </Col>
            </Row>

            <Row className='mt-3'>
                <Col>
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                        <TextField required id="outlined-required" label="Material" onChange={(event) => setMaterial(event.target.value)} placeholder="Material del producto"/>
                    </FormControl>
                </Col>
                <Col>
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                        <TextField required id="outlined-required" label="Marca" onChange={(event) => setMarca(event.target.value)} placeholder="Marca del producto"/>
                    </FormControl>
                </Col>
                <Col>
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                        <TextField required id="outlined-required" label="Dimensiones" onChange={(event) => setDimensions(event.target.value)} placeholder="Dimensiones del producto"/>
                    </FormControl>
                </Col>
            </Row>
            <Row className='mt-3'>
                <Col>
                    <FormControl sx={{ m: 1, minWidth: 220 }}>
                        <InputLabel id="conditionLabel">Condicion del producto *</InputLabel>
                        <Select labelId="conditionLabel" required label="Condicion del producto *" onChange={(event) => setConditions(event.target.value)} >
                            <MenuItem value=""> <em>Seleccione una</em> </MenuItem>
                            <MenuItem value={'Nuevo'}>Nuevo</MenuItem>
                            <MenuItem value={'Semi nuevo'}>Semi nuevo</MenuItem>
                            <MenuItem value={'Rehabilitado'}>Rehabilitado</MenuItem>
                            <MenuItem value={'Usado'}>Usado</MenuItem>
                        </Select>
                    </FormControl>
                </Col>
                <Col>
                    <FormControl sx={{ m: 1, minWidth: 150 }}>
                        <TextField required id="outlined-number" label="Precio inicial" type="number" step=".01" min="0" onChange={(event) => setInitialPrice(event.target.value)}/>
                    </FormControl>
                </Col>
                <Col>
                    <FormControl sx={{ m: 1, minWidth: 250 }}>
                        <TextField required id="outlined-number" label="Precio comprar ahora" type="number" step=".01" min="0" onChange={(event) => setBuyNow(event.target.value)}/>
                    </FormControl>
                </Col>
            </Row>

            <Row className='mt-3'>
                <Col>
                    
                    <FormControl sx={{ m: 1,width: 730, maxWidth: '100%' }}>
                        <TextField required id="outlined-multiline-flexible" label="Observaciones del producto" multiline maxRows={4} onChange={(event) => setObservations(event.target.value)} onKeyUp={(event) => setcaracRestantes(event.target.value.length)}/>
                    </FormControl>
                    <p className='text-danger fs-7 fw-light'>{caracRestantes} de 200 caracteres permitidos</p>
                </Col>
            </Row>


            <Row>
                <Col>
                    <FormControl sx={{ m: 1,width: 730, maxWidth: '100%' }}>
                        <TextField required label="Fecha de finalizacion de subasta" data-date-inline-picker="true" type="datetime-local" onChange={(event) => setCloseDate(event.target.value)} InputLabelProps={{shrink: true}}/>
                    </FormControl>
                </Col>
            </Row>

            <Row className='mt-3'>
                <Col>
                    <h4>Imagenes del articulo<strong className='text-danger'>*</strong> (Max 6)</h4>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Control type="file" accept="image/png,image/jpeg" className="form-control" ref={imgRef} multiple onChange= {(e) => imageValidator(e.target.files, imgRef)}/>
                </Col>
            </Row>

            <Row className='mt-3'>
                <Col className='d-flex justify-content-center'>
                    <Button disabled={ validateButton() } type='submit' block="true" className='w-50' variant="contained" color="success">
                        Solicitar Subasta
                    </Button>
                </Col>
            </Row>
        </Form>
    </Container>
)
}

export default CreateProduct