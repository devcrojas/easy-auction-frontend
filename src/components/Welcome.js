/* eslint-disable no-dupe-keys */
import { React, useState } from 'react'
import { Container, Row, Col, Image, Button, Offcanvas, CloseButton } from 'react-bootstrap'
import Logo from '../images/EasyAuction1.svg'
import LogoMision from '../images/mision-image.jpeg'
import LogoVision from '../images/home-vision.jpeg'
import { RiLoginCircleLine } from 'react-icons/ri';
import Auth from './Auth';


function Welcome() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container fluid>
      <Row className='home-row'>
        <Col md='12' className='div-welcome d-flex flex-column align-items-center justify-content-center'>
          <div className="p-2">
            <Image className='logo-welcome' src={Logo}></Image>
          </div>
          <div className="p-2">
            <Button variant="outline-dark" style={{borderRadius: "300rem", fontSize: "1.1rem"}}><strong>Ingresar como invitado</strong></Button>&nbsp;&nbsp;&nbsp;
            <Button variant="outline-success" onClick={handleShow} style={{borderRadius: "300rem", fontSize: "1.1rem"}}><strong>Iniciar sesión</strong></Button>
            <Offcanvas placement='end' show={show} onHide={handleClose}>
              <Offcanvas.Header className='text-light' style={{ backgroundImage: "linear-gradient(#000046, #053884)" }}>
                <h4><RiLoginCircleLine /></h4>
                <Offcanvas.Title>Inicio de sesión</Offcanvas.Title>
                <CloseButton variant="white" onClick={handleClose} />
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Auth></Auth>
              </Offcanvas.Body>
            </Offcanvas>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md='6' className='div-welcome-mision d-flex flex-column align-items-center justify-content-center'>
          <div>
            <h1 className='text-light mt-4'>Misión</h1>
          </div>
          <div>
            <p className='text-light'>
              Bajo los principios de honestidad, calidad y responsabilidad social ser la empresa más influyente en el ámbito nacional en la realización de subastas presenciales y electrónicas para la colocación de activos (vehículos, inmuebles, mercancía diversa e industrial) llevando oportunidades de negocio a los diferentes sectores de la sociedad.Somos una empresa comprometida con nuestros clientes, buscando siempre la satisfacción total, tanto de las empresas que nos confían sus activos, como de los compradores finales.
            </p>
          </div>
        </Col>
        <Col md='6' className='div-welcome-mision d-flex align-items-center justify-content-center'>
          <Image className='image-mision img-fluid' roundedCircle='true' src={LogoMision}></Image>
        </Col>
      </Row>
      <Row>
        <Col md='6' className='div-welcome-vision d-flex align-items-center justify-content-center'>
          <Image className='image-vision img-fluid' roundedCircle='true' src={LogoVision}></Image>
        </Col>
        <Col md='6' className='div-welcome-vision d-flex flex-column align-items-center justify-content-center'>
          <div>
            <br></br>
            <h1 className='text-light'>Visión</h1>
          </div>
          <div>
            <p className='text-light'>
              Ser una empresa con un excelente ambiente laboral, donde los individuos estén inspirados a ser y dar lo mejor de sí, con trato cordial llegando a ser familia, siendo no solo empleados sino ciudadanos responsables que ayuden al desarrollo de sus comunidades.Siempre consientes de nuestras responsabilidades de forma que se satisfagan los deseos y necesidades de nuestros clientes, creando un valor extra a las actividades que desempeñamos.Manteniendo así, relaciones de largo plazo con los socios, proveedores y empresas a las que les brindamos nuestros servicios con sentido humano que es nuestro diferenciador más importante.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
/*/

/*/
export default Welcome