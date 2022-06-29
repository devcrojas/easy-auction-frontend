import React, { useState, useRef } from 'react'
import { Form, Container, Col, Row, Button } from 'react-bootstrap'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'
import axios from 'axios';

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
    const [images, setImages] = useState();
    //Referencias de imagenes
    let imgRef = useRef(null);
    //Contador para los inputs de tipo file

    const sendData = (e) => {
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
        fetchingData(formData)
    
    }

    const fetchingData = async (formData) => {

        let resp = await axios.post('http://localhost:8080/products', formData);

        console.log("resp",resp)

        if(resp.status === 201){
            //props.modal = false;
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

    const imageValidator = async (file, setter, reference) => {

        //valida que sean 6 o menos
        if(file.length <= 6){
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
                        title: '¡Un archivo no es una imagen!',
                        text: 'Por favor solo suba archivos PNG y JPEG'
                    });
                }
            }
        } else {
            await setter('')
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
        <Form className="createForm" onSubmit={sendData} encType='multipart/form-data'>
            <Row>
                <Col>
                    <h6 className='mandatories'>Los campos con <strong className='text-danger'>*</strong> son obligatorios</h6>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Label className='inputForm'>Nombre del producto<strong className='text-danger'>*</strong></Form.Label>
                    <Form.Control required={true} onChange={(event) => setProductName(event.target.value)} id="productName" type="text" placeholder="Nombre"/>
                </Col>
                <Col>
                    <Form.Label className='inputForm'>Categoria<strong className='text-danger'>*</strong></Form.Label>
                    <Form.Select required={true} onChange={(event) => setCategory(event.target.value)}>
                        <option value={''}>Seleccione una</option>
                        <option>Ropa</option>
                        <option>Tecnologia</option>
                        <option>Artes</option>
                        <option>Libros</option>
                        <option>Joyeria</option>
                        <option>Instrumentos musicales</option>
                        <option>Videojuegos</option>
                        <option>Comics</option>
                        <option>Juguetes</option>
                    </Form.Select>
                </Col>
            </Row>

            <Row className='mt-3'>
                <Col>
                    <Form.Label>Material<strong className='text-danger'>*</strong></Form.Label>
                    <Form.Control required={true} onChange={(event) => setMaterial(event.target.value)} type="text" placeholder="Material del producto" className='inputForm'/>
                </Col>
                <Col>
                    <Form.Label>Marca<strong className='text-danger'>*</strong></Form.Label>
                    <Form.Control required={true} onChange={(event) => setMarca(event.target.value)} type="text" placeholder="Material del producto"/>               
                </Col>
            </Row>
            <Row className='mt-3'>
                <Col>
                    <Form.Label>Dimensiones<strong className='text-danger'>*</strong></Form.Label>
                    <Form.Control required={true} onChange={(event) => setDimensions(event.target.value)} type="text" placeholder="Dimensiones del producto"/>
                </Col>
                <Col>
                    <Form.Label>Condicion del producto<strong className='text-danger'>*</strong></Form.Label>
                    <Form.Select required={true} onChange={(event) => setConditions(event.target.value)}>
                        <option value={''}>Seleccione una</option>
                        <option>Nuevo</option>
                        <option>Casi nuevo</option>
                        <option>Rehabilitado</option>
                        <option>Poco Usado</option>
                        <option>Usado</option>
                    </Form.Select>
                </Col>
            </Row>

            <Row className='mt-3'>
                <Col>
                    <Form.Label>Precio inicial<strong className='text-danger'>*</strong></Form.Label>
                    <Form.Control required={true} step=".01" onChange={(event) => setInitialPrice(event.target.value)} type="number" placeholder="Precio inicial de subasta"/>
                </Col>
                <Col>
                    <Form.Label>Precio para comprar ahora<strong className='text-danger'>*</strong></Form.Label>
                    <Form.Control required={true} step=".01" onChange={(event) => setBuyNow(event.target.value)} type="number" placeholder="Precio para comprar ahora y cerrar subasta"/>
                </Col>
            </Row>

            <Row className='mt-3'>
                <Col>
                    <Form.Label>Observaciones del producto<strong className='text-danger'>*</strong></Form.Label>
                    <Form.Control required={true} onChange={(event) => setObservations(event.target.value)} maxLength={200} as="textarea" placeholder="Por favor ingrese sus observaciones" rows={3} onKeyUp={(event) => setcaracRestantes(event.target.value.length)}/>
                    <p className='text-danger fs-7 fw-light'>{caracRestantes} de 200 caracteres permitidos</p>
                </Col>
            </Row>


            <Row>
                <Col>
                    <Form.Label>Fecha de finalizacion de subasta<strong className='text-danger'>*</strong></Form.Label>
                    <Form.Control required={true} onChange={(event) => setCloseDate(event.target.value)} data-date-inline-picker="true" type="datetime-local" placeholder="Fecha y hora de cierre de subasta"/>
                </Col>
            </Row>

            <Row className='mt-3'>
                <Col>
                    <h4>Imagenes del articulo<strong className='text-danger'>*</strong> (Max 6)</h4>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Control type="file" accept="image/png,image/jpeg" className="form-control" ref={imgRef} multiple onChange= {(e) => imageValidator(e.target.files, setImages, imgRef)}/>
                </Col>
            </Row>

            <Row className='mt-3'>
                <Col className='d-flex justify-content-center'>
                    <Button disabled={ validateButton() } type='submit' block="true" className='w-50' variant="success">
                        Solicitar Subasta
                    </Button>
                </Col>
            </Row>
        </Form>
    </Container>
)
}

export default CreateProduct