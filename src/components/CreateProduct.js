import React, { useState, useRef, useEffect, Fragment } from 'react'
import { Form, Container, Col, Row } from 'react-bootstrap'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'
import axios from 'axios';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Card, ImageList, ImageListItem, CardContent, Tooltip } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import ImageIcon from '@mui/icons-material/Image';
import ClearIcon from '@mui/icons-material/Clear';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import AddIcon from '@mui/icons-material/Add';
import AuthService from '../services/auth.service'
import MenuLateral from './MenuLateral';
import NavBarMenu from './NavBarMenu';
import { useParams } from "react-router-dom";
import moment from 'moment';

const CreateProduct = () => {
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
    const [closeDate, setCloseDate] = useState(new Date());
    const [closeDateVisual, setCloseDateVisual] = useState();
    // Variables para las imagenes(Creacion)
    const [imagePrincipal, setImagePrincipal] = useState('');
    const [images, setImages] = useState('');
    const [preview, setPreview] = useState('');
    const [secondaryPreview, setSecondaryPreview] = useState('');
    const [imagesCount, setImagesCount] = useState(0);
    
    //Referencias de los campos
    let imgPrincipalRef = useRef(null);
    let imagesRef = useRef(null);
    // Obtiene el product id del parametro
    let { productId } = useParams();
    // Variable para obtener el producto si se esta actualizando
    const [product, setProduct] = useState();
    // Se obtiene el usuario de sesion
    const [user, setUser] = useState(AuthService.getCurrentUser());
    // Se obtiene la fecha actual
    const actualDate = new Date();

    // UseEffect para traerse el detalle del producto si se esta actualizando
    useEffect(() => {
        if(productId){
            getProductDetail(productId);
        }
    }, [])
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

    // Funcion para obtener el detalle del producto si esta actualizando
    const getProductDetail = async (id) => {
        let resp = await axios.get('/api/products/'+id,{
                headers: { 'Authorization':'Bearer '+ localStorage.getItem("token")
            }});
        // Se obtiene el status de la respuesta
        if(resp.status === 200){
            //Valida si el id del usuario de sesion sea el del producto, de lo contrario que lo mande a la lista general
            if(resp.data.sellerData._id === user.id){
                await fillForm(resp.data);
            }else {
                window.location.href = "/productos";

            }
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Error: '+resp.status,
                text: resp.statusText,
            })
        }
    }

    // Funcion para preparar los datos a enviar
    const prepareData = (e) => {
        // Previene que se actualize la pagina
        e.preventDefault();
        // Valida de nuevo que los campos esten bien
        if(validateButton()){
            return;
        }
        // Inicia los parametros para el envio de datos
        let formData = new FormData();
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
        if(imagePrincipal !== ''){
            formData.append("file", imagePrincipal[0])
        }
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
        // Si esta editando que no vuelva a mandar la create date
        if(!productId){
            formData.append("create", actualDate)
        }
        formData.append("final", finalDate)
        // Se mandan los datos del status y usuario
        if(product){
            formData.append("status", product.status)
        }else{
            formData.append("status", 'inactive')
        }
        formData.append("email", user.id)
        // Se manda a realizar la peticion
        sendData(formData)
    }

    // Funcion para enviar los datos del form
    const sendData = async (formData) => {
        let resp;
        if(product){
            // Se realiza la peticion al back para la actualizacion
            resp = await axios.put('/api/products/'+product._id, formData, {
                headers: { 'Authorization':'Bearer '+ localStorage.getItem("token")
            }});
        }else{
            // Se realiza la peticion al back para la creacion
            resp = await axios.post('/api/products', formData, {
                headers: { 'Authorization':'Bearer '+ localStorage.getItem("token")
            }});
        }
        // Se obtiene el status de la respuesta
        if(resp.status === 201){
            if(product){
                Swal.fire({
                    icon: 'success',
                    title: '¡Ah actualizado su subasta!',
                    text: '¿Quiere volver a sus productos?',
                    showCancelButton: true,
                    confirmButtonColor: '#5cb85c',
                    cancelButtonColor: '#d9534f',
                    confirmButtonText: 'Volver a mis productos',
                    cancelButtonText: 'Actualizar mas campos',
                }).then(async (result) => { 
                    if (result.isConfirmed) {
                        window.location.href = "/misproductos"
                    }
                });
            }else {
                Swal.fire({
                    icon: 'success',
                    title: '¡Ah solicitado una subasta!',
                    html: 'Ah solicitado correctamente la subasta, por favor espere a que nuestro equipo la autorize!</br>' +
                          '¿Desea agregar otro producto?',
                    showCancelButton: true,
                    confirmButtonColor: '#5cb85c',
                    cancelButtonColor: '#d9534f',
                    confirmButtonText: 'Añadir otro producto',
                    cancelButtonText: 'Ir a mis productos',
                }).then(async (result) => { 
                    if (result.isConfirmed) {
                        cleanForm();
                    }else {
                        window.location.href = "/misproductos"
                    }
                });
            }
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Error: '+resp.status,
                text: resp.statusText,
            })
        }
    }

    // Funcion para limpiar el formulario
    const cleanForm = async () => {
        // Inicializa los caracteres restantes
        setcaracRestantes(0);
        // Inicializa las variables para el formulario
        setProductName('');
        setCategory('');
        setMaterial('');
        setMarca('');
        setDimensions('');
        setConditions('');
        setObservations('');
        setBuyNow('');
        setInitialPrice('');
        setCloseDate(new Date());
        setCloseDateVisual('');
        // Inicializa las Variables para las imagenes
        setImagePrincipal('');
        imgPrincipalRef.current.value = '';
        setImages('');
        imagesRef.current.value = '';
    }

    // Funcion para inicializar el formulario si esta actualizando
    const fillForm = (producto) => {
            // Le da su valor a product
            setProduct(producto)
            // Inicializa los caracteres restantes
            setcaracRestantes(producto.description.observations.length);
            // Inicializa las variables para el formulario
            setProductName(producto.nameProduct);
            setCategory(producto.category);
            setMaterial(producto.description.material);
            setMarca(producto.description.marca);
            setDimensions(producto.description.dimensions);
            setConditions(producto.description.actualCondition);
            setObservations(producto.description.observations);
            setBuyNow(producto.price.buyNow);
            setInitialPrice(producto.price.initialP);
            // Obtiene cuantas imagenes tiene actualmente
            producto.files.forEach((element, index) => {
                setImagesCount(index+1)
            });
            // Se obtiene el tiempo de fin y rellena el date time local
            const finalDate = new Date(producto.auctionDate.final);
            const hours = (finalDate.getHours().toString().length === 1) ? '0'+finalDate.getHours():finalDate.getHours();
            const minutes = (finalDate.getMinutes().toString().length === 1) ? '0'+finalDate.getMinutes():finalDate.getMinutes();
            settingCloseDates(moment(new Date(producto.auctionDate.final)).format('YYYY-MM-DDT'+hours+':'+minutes+':00.000'));
    }

    //Funcion para validar si el boton se bloquea o no
    const validateButton = () => {
        if(product){
            // Valida que ningun campo este vacio en la actualizacion
            if(productName  === '' || category   === '' || material === '' || 
               marca        === '' || dimensions === '' || conditions === '' || 
               observations === '' || buyNow     === '' || initialPrice === '' || 
               closeDate    === ''){
                return true;
            }else{
                // Valido la endDate y el precio buyNow
                if((closeDate.getTime() < actualDate.getTime()) || (buyNow < initialPrice)){
                    return true;
                }else {
                    return false;
                }
            }
        }else{
            // Valida que ningun campo este vacio en la creacion
            if(productName  === '' || category   === '' || material === '' || 
               marca        === '' || dimensions === '' || conditions === '' || 
               observations === '' || buyNow     === '' || initialPrice === '' || 
               closeDate    === '' || images === '' || imagePrincipal === ''){
                return true;
            }else{
                // Valido la endDate y el precio buyNow
                if((closeDate.getTime() < actualDate.getTime()) || (buyNow < initialPrice)){
                    return true;
                }else {
                    return false;
                }
            }
        }
    }

    // Funcion para validar las imagenes
    const imageValidator = async (file, reference, setter) => {
        // Valida que sean 5 o menos
        if(file.length <= 5){
            // Recorre los files
            for (let i = 0; i < file.length; i++) {
                //Valida que sea una imagen
                if(file[i].type === 'image/png' || file[i].type === 'image/jpeg'){
                    //Le da su valor
                    await setter(file)
                    setImagesCount(imagesCount+1)
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

    // Funcion para validar fechas
    const settingCloseDates = (value) => {
        setCloseDateVisual(value);
        setCloseDate(new Date(value));
    }

    // const deleteSingleImage = (image, imageId) => {
    //     if(image && image.fileName){
    //         // Quita del array de imagenes del back la seleccionada
    //         const i = product.files.indexOf( image );
    //         if ( i !== -1 ) {
    //             product.files.splice( i, 1 );
    //         }
    //         console.log('product.files',product.files);
    //     }else {
    //         // Quita del array de preview de la imagen seleccionada
    //         const i = secondaryPreview.indexOf( image);
    //         if ( i !== -1 ) {
    //             secondaryPreview.splice( i, 1 );
    //         }
    //         //
    //         console.log('images',images[imageId]);
    //         console.log('secondaryPreview',secondaryPreview);
    //     }
    //     document.getElementById(imageId).style.display = "none";
    // }

return (
    <Fragment>
        <NavBarMenu view={"Reviews"}></NavBarMenu>
        <Container style={{ background: "#F0F2F5" }} fluid>
            <Row>
                <Col xs={3} className="sidebarEasy">
                    <MenuLateral view={"MyProducts"}></MenuLateral>
                </Col>
                <Col xs={9}>
                    <Card className='my-3' sx={{ width:'100%', borderRadius: 5 }} elevation={10}>
                        <CardContent>
                            <Form onSubmit={prepareData} encType='multipart/form-data'>
                                {/* Header del formulario */}
                                <Row>
                                    <Col xs={12}>
                                        <div className="border-bottom text-center">
                                            <div><h4>Solicitar subasta</h4></div>
                                            <div><h6>Los campos con <strong className='text-danger'>*</strong> son obligatorios</h6></div>
                                        </div>
                                    </Col>
                                </Row>
                                {/* Nombre y categoria del producto */}
                                <Row>
                                    <Col xs={12} sm={6}>
                                        <FormControl className='w-100 my-2'>
                                            <TextField required id="outlined-required" label="Nombre del producto" value={productName}
                                                       onChange={(event) => setProductName(event.target.value)} placeholder="Nombre" name='productName'/>
                                        </FormControl>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <FormControl className='w-100 my-2'>
                                            <InputLabel id="categoryLabel">Categoria *</InputLabel>
                                            <Select value={category} labelId="categoryLabel" required label="Categoria *" 
                                                    onChange={(event) => setCategory(event.target.value)} >
                                                <MenuItem value=""> <b>Seleccione una</b> </MenuItem>
                                                <MenuItem value={'Ropa'}>Ropa</MenuItem>
                                                <MenuItem value={'Tecnologia'}>Tecnologia</MenuItem>
                                                <MenuItem value={'Artes'}>Artes</MenuItem>
                                                <MenuItem value={'Libros'}>Libros</MenuItem>
                                                <MenuItem value={'Joyeria'}>Joyeria</MenuItem>
                                                <MenuItem value={'Instrumentos musicales'}>Instrumentos musicales</MenuItem>
                                                <MenuItem value={'Videojuegos'}>Videojuegos</MenuItem>
                                                <MenuItem value={'Comics'}>Comics</MenuItem>
                                                <MenuItem value={'Artículos para el hogar'}>Artículos para el hogar</MenuItem>
                                                <MenuItem value={'Articulos deportivos'}>Articulos deportivos</MenuItem>
                                                <MenuItem value={'Herramientas para autos'}>Herramientas para autos</MenuItem>
                                                <MenuItem value={'Accesorios para autos'}>Accesorios para autos</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Col>
                                </Row>
                                {/* Material, marca y dimesiones del producto */}
                                <Row>
                                    <Col xs={12} sm={12} md={4}>
                                        <FormControl className='w-100 my-2'>
                                            <TextField required id="outlined-required" label="Material" value={material}
                                                       onChange={(event) => setMaterial(event.target.value)} 
                                                       placeholder="Material del producto" name='material'/>
                                        </FormControl>
                                    </Col>
                                    <Col xs={12} sm={6} md={4}>
                                        <FormControl className='w-100 my-2'>
                                            <TextField required id="outlined-required" label="Marca" value={marca}
                                                       onChange={(event) => setMarca(event.target.value)} 
                                                       placeholder="Marca del producto" name='marca'/>
                                        </FormControl>
                                    </Col>
                                    <Col xs={12} sm={6} md={4}>
                                        <FormControl className='w-100 my-2'>
                                            <TextField required id="outlined-required" label="Dimensiones/Talla" value={dimensions}
                                                       onChange={(event) => setDimensions(event.target.value)} 
                                                       placeholder="Dimensiones/Talla del producto" name='dimensions'/>
                                        </FormControl>
                                    </Col>
                                </Row>
                                {/* Condicion, precio inicial y comprar ahora del producto */}
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
                                            <TextField required id="outlined-number" label="Precio inicial" type="number" step=".01" 
                                                       onChange={(event) => setInitialPrice(Number(event.target.value))} value={initialPrice}
                                                       InputProps={{ inputProps: { min: 0 } }} error={(initialPrice <= 0 && initialPrice !== '') ? true:false}
                                                       helperText={(initialPrice <= 0 && initialPrice !== '') ? "El precio inicial no puede ser menor o igual a 0":""}/>
                                        </FormControl>
                                    </Col>
                                    <Col xs={12} sm={6} md={4}>
                                        <FormControl className='w-100 my-2'>
                                            <TextField required id="outlined-number" label="Precio comprar ahora" type="number" step=".01" 
                                                       error={(buyNow < initialPrice) ? true:false} InputProps={{ inputProps: { min: 0 } }} 
                                                       onChange={(event) => setBuyNow(Number(event.target.value))} value={buyNow}
                                                       helperText={(buyNow < initialPrice) ? "No debe ser menor al precio inicial":""}/>
                                        </FormControl>
                                    </Col>
                                </Row>
                                {/* Observaciones del producto */}
                                <Row>
                                    <Col xs={12}>
                                        <FormControl className='w-100 my-2'>
                                            <TextField required id="outlined-multiline-flexible" label="Observaciones del producto" value={observations}
                                                       multiline maxRows={4} onChange={(event) => setObservations(event.target.value)} inputProps={{ maxLength: "400" }}
                                                       onKeyUp={(event) => setcaracRestantes(event.target.value.length)} name='observations'/>
                                        </FormControl>
                                        <p className='text-danger fs-7 fw-light'>{caracRestantes} de 400 caracteres permitidos</p>
                                    </Col>
                                </Row>
                                {/* Fecha de finalizacion de la subasta */}
                                <Row>
                                    <Col xs={12}>
                                        <FormControl className='w-100 my-2'>
                                            <TextField required label="Fecha de finalizacion de subasta" data-date-inline-picker="true" 
                                                       type="datetime-local" onChange={(event) => settingCloseDates(event.target.value)} value={closeDateVisual}
                                                       InputLabelProps={{shrink: true}} error={(closeDate.getTime() < actualDate.getTime()) ? true:false}
                                                       helperText={(closeDate.getTime() < actualDate.getTime()) ? "La fecha de fin no puede ser menor a la actual":""}/>
                                        </FormControl>
                                    </Col>
                                </Row>
                                {/* Imagenes del producto */}
                                <Row>
                                    {/* Imagen principal */}
                                    <Col xs={12} lg={6}>
                                        <div className='w-100 my-2'>
                                            <h6>Imagen principal del articulo <strong className='text-danger'>*</strong></h6>
                                            <Button variant="contained" component="label" >
                                                <ImageIcon />
                                                {(product) ? "Cambiar imagen principal":"Elegir imagen principal"}
                                                <input  type="file" accept="image/png,image/jpeg" 
                                                        ref={imgPrincipalRef} className="form-control" 
                                                        onChange= {(e) => imageValidator(e.target.files, imgPrincipalRef, setImagePrincipal)} hidden />
                                            </Button>
                                            <div className='d-flex justify-content-center'>
                                                {(product && !imagePrincipal) ? <img style={{height: '120px'}} src={`\\${product.file.filePath}`} alt={product.file.nameProduct} />:''}
                                                {imagePrincipal && <img src={preview} alt='Principal' className='mt-3' style={{height: '120px'}} /> }
                                            </div>
                                        </div>
                                    </Col>
                                    {/* Imagenes secundarias */}
                                    <Col xs={12} lg={6}>
                                        <div className='w-100 my-2'>
                                            <h6>Imagenes secundarias del articulo (Max 5) <strong className='text-danger'>*</strong></h6>
                                            <Button variant="contained" component="label" >
                                                <CollectionsIcon />
                                                {(product) ? "Cambiar todas las imagenes":"Elegir imagenes"}
                                                <input  type="file" accept="image/png,image/jpeg" 
                                                        ref={imagesRef} multiple className="form-control"
                                                        onChange= {(e) => imageValidator(e.target.files, imagesRef, setImages)} hidden />
                                            </Button>
                                            {/* <Tooltip title="Agregar una imagen">
                                                <Button variant="contained" component="label" className='mx-2'>
                                                    <LibraryAddIcon/>
                                                    <input type="file" accept="image/png,image/jpeg" 
                                                           ref={imagesRef} multiple className="form-control"
                                                           onChange= {(e) => imageValidator(e.target.files, imagesRef, setImages)} hidden />
                                                </Button>
                                            </Tooltip> */}
                                            <ImageList cols={3} rowHeight={120} className='mt-3'>
                                                {
                                                    // Se muestran las imagenes que se traen en la actualizacion el producto
                                                    (!product) ? '':product.files.map( (dato, index) => {
                                                    return  <ImageListItem key={index} id={index}>
                                                                {/* <ClearIcon className='position-absolute bg-white text-dark rounded-circle' role="button" onClick={ () => deleteSingleImage(dato,index)}/> */}
                                                                <img src={`\\${dato.filePath}`} alt={index} style={{borderRadius: 2, height:"120px"}}/>
                                                            </ImageListItem>
                                                    })
                                                }
                                                {
                                                    // Se muestran las imagenes que se seleccionaron en el input
                                                    (!secondaryPreview) ? '':
                                                    secondaryPreview.map( (dato, index) => {
                                                    return  <ImageListItem key={index} id={index}>                                                
                                                                {/* <ClearIcon className='position-absolute bg-white text-dark rounded-circle' role="button" onClick={ () => deleteSingleImage(secondaryPreview[index],index)}/> */}
                                                                <img src={dato} alt='Secundarias' style={{borderRadius: 2}}/>
                                                            </ImageListItem>
                                                    })
                                                }
                                            </ImageList>
                                        </div>
                                    </Col>
                                </Row>
                                {/* Boton para solicitar subasta */}
                                <Row className='mt-3'>
                                    <Col className='d-flex justify-content-center'>
                                        <Button disabled={ validateButton() } type='submit' block="true" className='w-50' 
                                                variant="contained" color="success">
                                            Solicitar Subasta
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </CardContent>
                    </Card>
                </Col>
            </Row>
        </Container>
    </Fragment>
)
}

export default CreateProduct