import React, { useState, useRef, useEffect } from 'react'
import { Form, Container, Col, Row, Card } from 'react-bootstrap'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'
import axios from 'axios';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Backdrop, Box, Modal, Fade, ImageList, ImageListItem } from '@mui/material';
import AuthService from '../services/auth.service'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  height: '90%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  zIndex: '1 !important',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};


const CreateProduct = () => {
    // Variables para abrir y cerrar el modal
    const [showModal, setShowModal] = useState(false);
    // Manejador para cuando se sale del modal
    const handleClose = () => {
        setShowModal(false);
        //Reinicializa la imagen principal
        setImagePrincipal('');
        setPreview((imagePrincipal) ? URL.revokeObjectURL(imagePrincipal[0]):undefined)
        
        //Reinicializa las imagen secundarias
        setImages('');
        if(images){
            for (let i = 0; i < images.length; i++) {
                setSecondaryPreview(URL.revokeObjectURL(images[i]))
            }
        }

    }
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
    // Variables para las imagenes
    const [imagePrincipal, setImagePrincipal] = useState('');
    const [images, setImages] = useState('');

    const [preview, setPreview] = useState('');
    const [secondaryPreview, setSecondaryPreview] = useState('');

    //Referencias de imagenes
    let imgPrincipalRef = useRef(null);
    let imagesRef = useRef(null);
    // Se obtiene el usuario de sesion
    let user = AuthService.getCurrentUser();


    // UseEffect de la imagen principal para previsualizarla
    useEffect(() => {
        if (!imagePrincipal) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(imagePrincipal[0])
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [imagePrincipal])

    // UseEffect de las imagenes secundarias para previsualizarlas
    useEffect(() => {
        if (!images) {
            setSecondaryPreview(undefined)
            return
        }

        const objectUrl = []
        for (let i = 0; i < images.length; i++) {
            objectUrl.push(URL.createObjectURL(images[i]))                   
        }

        setSecondaryPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [images])

    // Funcion para preparar los datos a enviar
    const prepareData = (e) => {
        // Previene que se actualize la pagina
        e.preventDefault();
        // Inicia los parametros para el envio de datos
        let formData = new FormData();
        const actualDate = new Date();
        const finalDate = new Date(closeDate)

        // Se mandan las imagenes
        // Si se puso algo en imagenes se añaden al append
        if(images !== ''){
            if(images.length === 1){
                formData.append('files', images[0]);                      
            }else {
                for (let i = 0; i < images.length; i++) {
                    formData.append('files', images[i]);                      
                }
            }

        }
        // Se manda la imagen principal
        formData.append("file", imagePrincipal[0])
        // Se mandan los demas atributos del producto
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
        // Se mandan los datos del status y usuario
        formData.append("status", 'Active')
        formData.append("email", user.id)
        // Se manda a realizar la peticion
        sendData(formData)
    }

    // Funcion para enviar los datos del form
    const sendData = async (formData) => {
        // Se realiza la peticion al back
        let resp = await axios.post('/api/products', formData);
        // Se obtiene el status de la respuesta
        if(resp.status === 201){
            handleClose()
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

    //Funcion para validar si el boton se bloquea o no
    const validateButton = () => {
        if(productName  === '' || category   === '' || material === '' || 
           marca        === '' || dimensions === '' || conditions === '' || 
           observations === '' || buyNow     === '' || initialPrice === '' || 
           closeDate    === '' || images === '' || imagePrincipal === ''){
            return true;
        }else{
            return false;
        }
    }
    // Funcion para validar las imagenes
    const imageValidator = async (file, reference, setter) => {
        console.log('user',user);
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
                        <Card.Title>¿Quieres tambien subastar?</Card.Title>
                        <Card.Text>
                            No pierdas tiempo y realiza una subasta tu tambien que esperas!
                        </Card.Text>
                        <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>
                            Solicitar subasta
                        </Button>
                    </Card.Body>
                </Card>

                <Modal  aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description"
                        open={showModal} onClose={handleClose} closeAfterTransition
                        BackdropComponent={Backdrop} BackdropProps={{ timeout: 500, }}>
                    <Fade in={showModal}>
                        <Box sx={modalStyle} className='overflow-auto prettyScroll'>
                            <Container>
                                <Form onSubmit={prepareData} encType='multipart/form-data'>
                                    <Row>
                                        <Col xs={12}>
                                            <div className="border-bottom">
                                                <div><h4>Solicitar subasta</h4></div>
                                                <div><h6>Los campos con <strong className='text-danger'>*</strong> son obligatorios</h6></div>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12} sm={6}>
                                            <FormControl className='w-100 my-2'>
                                                <TextField required id="outlined-required" label="Nombre del producto" onChange={(event) => setProductName(event.target.value)} placeholder="Nombre"/>
                                            </FormControl>
                                        </Col>
                                        <Col xs={12} sm={6}>
                                            <FormControl className='w-100 my-2'>
                                                <InputLabel id="categoryLabel">Categoria *</InputLabel>
                                                <Select value={category} labelId="categoryLabel" required label="Categoria *" onChange={(event) => setCategory(event.target.value)} >
                                                    <MenuItem value=""> <b>Seleccione una</b> </MenuItem>
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

                                    <Row>
                                        <Col xs={12} sm={12} md={4}>
                                            <FormControl className='w-100 my-2'>
                                                <TextField required id="outlined-required" label="Material" onChange={(event) => setMaterial(event.target.value)} placeholder="Material del producto"/>
                                            </FormControl>
                                        </Col>
                                        <Col xs={12} sm={6} md={4}>
                                            <FormControl className='w-100 my-2'>
                                                <TextField required id="outlined-required" label="Marca" onChange={(event) => setMarca(event.target.value)} placeholder="Marca del producto"/>
                                            </FormControl>
                                        </Col>
                                        <Col xs={12} sm={6} md={4}>
                                            <FormControl className='w-100 my-2'>
                                                <TextField required id="outlined-required" label="Dimensiones" onChange={(event) => setDimensions(event.target.value)} placeholder="Dimensiones del producto"/>
                                            </FormControl>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12} sm={12} md={4}>
                                            <FormControl className='w-100 my-2'>
                                                <InputLabel id="conditionLabel">Condicion del producto *</InputLabel>
                                                <Select value={conditions} labelId="conditionLabel" required label="Condicion del producto *" onChange={(event) => setConditions(event.target.value)} >
                                                    <MenuItem value=""> <b>Seleccione una</b> </MenuItem>
                                                    <MenuItem value={'Nuevo'}>Nuevo</MenuItem>
                                                    <MenuItem value={'Semi nuevo'}>Semi nuevo</MenuItem>
                                                    <MenuItem value={'Rehabilitado'}>Rehabilitado</MenuItem>
                                                    <MenuItem value={'Usado'}>Usado</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Col>
                                        <Col xs={12} sm={6} md={4}>
                                            <FormControl className='w-100 my-2'>
                                                <TextField required id="outlined-number" label="Precio inicial" type="number" step=".01" min="0" onChange={(event) => setInitialPrice(event.target.value)}/>
                                            </FormControl>
                                        </Col>
                                        <Col xs={12} sm={6} md={4}>
                                            <FormControl className='w-100 my-2'>
                                                <TextField required id="outlined-number" label="Precio comprar ahora" type="number" step=".01" min="0" onChange={(event) => setBuyNow(event.target.value)}/>
                                            </FormControl>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12}>
                                            <FormControl className='w-100 my-2'>
                                                <TextField required id="outlined-multiline-flexible" label="Observaciones del producto" multiline maxRows={4} onChange={(event) => setObservations(event.target.value)} onKeyUp={(event) => setcaracRestantes(event.target.value.length)}/>
                                            </FormControl>
                                            <p className='text-danger fs-7 fw-light'>{caracRestantes} de 200 caracteres permitidos</p>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12}>
                                            <FormControl className='w-100 my-2'>
                                                <TextField required label="Fecha de finalizacion de subasta" data-date-inline-picker="true" type="datetime-local" onChange={(event) => setCloseDate(event.target.value)} InputLabelProps={{shrink: true}}/>
                                            </FormControl>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12} lg={6}>
                                            <div className='w-100 my-2'>
                                                <h6>Imagen principal del articulo <strong className='text-danger'>*</strong></h6>
                                                <Form.Control  type="file" accept="image/png,image/jpeg" className="form-control" ref={imgPrincipalRef} onChange= {(e) => imageValidator(e.target.files, imgPrincipalRef, setImagePrincipal)}/>
                                                <div className='d-flex justify-content-center'>
                                                    {imagePrincipal && <img src={preview} alt='Principal' className='mt-3' style={{height: '120px'}} /> }
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={12} lg={6}>
                                            <div className='w-100 my-2'>
                                                <h6>Imagenes secundarias del articulo (Max 5) <strong className='text-danger'>*</strong></h6>
                                                <Form.Control type="file" accept="image/png,image/jpeg" className="form-control" ref={imagesRef} multiple onChange= {(e) => imageValidator(e.target.files, imagesRef, setImages)}/>
                                                <ImageList cols={3} rowHeight={120} className='mt-3' style={secondaryPreview ? {border: '1px solid #000'}:{}}>
                                                {
                                                    !secondaryPreview ? '':
                                                    secondaryPreview.map( (dato, index) => {
                                                    return  <ImageListItem>
                                                                    <img src={dato} alt='Secundarias' style={{borderRadius: 2}}/>
                                                            </ImageListItem>
                                                    })
                                                }
                                                </ImageList>
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
                                                Solicitar Subasta
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

export default CreateProduct