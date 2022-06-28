/* eslint-disable no-unused-expressions */
import React, { useState, useRef } from 'react'
import { Form, Container, Col, Row, Button } from 'react-bootstrap'
import Productos from './Products'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'

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
    //Variables para las imagenes
    const [image1, setImage1] = useState();
    const [image2, setImage2] = useState();
    const [image3, setImage3] = useState();
    const [image4, setImage4] = useState();
    const [image5, setImage5] = useState();
    const [image6, setImage6] = useState();
    // const [images, setImages] = useState([]);X
    //Referencias de imagenes
    let imgRef1 = useRef(null);
    let imgRef2 = useRef(null);
    let imgRef3 = useRef(null);
    let imgRef4 = useRef(null);
    let imgRef5 = useRef(null);
    let imgRef6 = useRef(null);
    //Contador para los inputs de tipo file
    const [countInput, setCountInput] = useState(1);

    const sendData = (e) => {
        e.preventDefault();

        //Se llena el array de imagenes
        const imagesArray = [];
        imagesArray.push(image1);
        (image2) ? imagesArray.push(image2):'';
        (image3) ? imagesArray.push(image3):'';
        (image4) ? imagesArray.push(image4):'';
        (image5) ? imagesArray.push(image5):'';
        (image6) ? imagesArray.push(image6):'';
        console.log("img",imagesArray);
        
        //Se crea el objeto a mandar
        //Se obtiene la fecha actual de la subasta
        // const actualDate = new Date();
        // const product = {
        //     nameProduct: productName,
        //     category: category,
        //     description: {
        //         material: material,
        //         marca: marca,
        //         dimensions: dimensions,
        //         actualCondition: conditions,
        //         observations: observations
        //     },
        //     price:{
        //         initialP:initialPrice,
        //         buyNow:buyNow
        //     },
        //     auctionDate: {
        //         initialD: actualDate,
        //         final: closeDate
        //     },
        //     files: imagesArray
        // };
        // console.log("producto",product)

        fetchingData(imagesArray)
    
    }

    const fetchingData = async (imagesArray) => {

        let formData = new FormData();
        const actualDate = new Date();
        const finalDate = new Date(closeDate)

        // formData.append("body", product)
        formData.append("files", imagesArray)
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

        console.log("formData",formData)

        // const myHeaders = new Headers();
        // myHeaders.append("Content-Type", "multipart/form-data");
        let resp = await fetch('http://localhost:8080/products',
        {
            method: 'POST',
            // headers: myHeaders,
            body: formData
        })

        console.log("resp",resp)

        if(resp.ok){
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

    //Funcion para quitar el contador de la imagen
    const substractCountImage = () => {
        if (countInput === 2) {
            setImage2('')
            setImage3('')
            setImage4('')
            setImage5('')
            setImage6('')
        }
        if (countInput === 3) {
            setImage3('')
            setImage4('')
            setImage5('')
            setImage6('')
        }
        if (countInput === 4) {
            setImage4('')
            setImage5('')
            setImage6('')
        }
        if (countInput === 5) {
            setImage5('')
            setImage6('')
        }
        if (countInput === 6) {
            setImage6('')
        }
        (countInput === 1) ? setCountInput(countInput):setCountInput(countInput-1)
    }

    //Funcion para validar si el boton se lo bloquea o no
    const validateButton = () => {
        if(productName === '' || category === '' || material === '' || marca === '' || dimensions === '' || conditions === '' || observations === '' || buyNow === '' || initialPrice === '' || closeDate === '' ){
            return true;
        }else{
            if(countInput === 1 && image1){
                return false;
            }
            if(countInput <= 2 && (image1 && image2)){
                return false;
            }
            if(countInput <= 3 && (image1 && image2 && image3)){
                return false;
            }
            if(countInput <= 4 && (image1 && image2 && image3 && image4)){
                return false;
            }
            if(countInput <= 5 && (image1 && image2 && image3 && image4 && image5)){
                return false;
            }
            if(countInput <= 6 && (image1 && image2 && image3 && image4 && image5 && image6)){
                return false;
            }
            return true;
        }
    }

    const imageValidator = async (file, setter, reference) => {
        if(file.type === 'image/png' || file.type === 'image/jpeg'){
            file.path = file.name
            file.originalname = file.name
            file.mimetype = file.type
            await setter(file)
        }else{
            await setter('')
            reference.current.value = '';
            Swal.fire({
                icon: 'error',
                title: '¡No es una imagen!',
                text: 'Por favor solo suba archivos PNG y JPEG'
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
                    <h4> Imagen del articulo<strong className='text-danger'>*</strong>
                        <Button disabled={(countInput === 1) ? true:false} className='mx-2' variant="primary" size="sm" onClick={() => substractCountImage()}>
                            -
                        </Button>
                        <Button disabled={(countInput === 6) ? true:false} className='mx-2' variant="primary" size="sm" onClick={() => (countInput === 6) ? null:setCountInput(countInput+1) }>
                            +
                        </Button>
                    </h4>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Control type="file" accept="image/png,image/jpeg" ref={imgRef1} multiple onChange= {(e) => imageValidator(e.target.files[0], setImage1, imgRef1)}/>
                </Col>
                {(countInput >= 2) ? <Col><Form.Control type="file" accept="image/png,image/jpeg" ref={imgRef2} onChange= {(e) => imageValidator(e.target.files[0], setImage2, imgRef2)} /></Col> : null}
            </Row>
            <Row className='mt-2'>
                {(countInput >= 3) ? <Col><Form.Control type="file" accept="image/png,image/jpeg" ref={imgRef3} onChange= {(e) => imageValidator(e.target.files[0], setImage3, imgRef3)} /></Col> : null}
                {(countInput >= 4) ? <Col><Form.Control type="file" accept="image/png,image/jpeg" ref={imgRef4} onChange= {(e) => imageValidator(e.target.files[0], setImage4, imgRef4)} /></Col> : null}
            </Row>
            <Row className='mt-2'>
                {(countInput >= 5) ? <Col><Form.Control type="file" accept="image/png,image/jpeg" ref={imgRef5} onChange= {(e) => imageValidator(e.target.files[0], setImage5, imgRef5)} /></Col> : null}
                {(countInput === 6) ? <Col><Form.Control type="file" accept="image/png,image/jpeg" ref={imgRef6} onChange= {(e) => imageValidator(e.target.files[0], setImage6, imgRef6)} /></Col> : null}
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