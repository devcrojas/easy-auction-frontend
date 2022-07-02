import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Button, Row, Col, Card, Form } from "react-bootstrap";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'
import { Container } from "@mui/system";
import AuthService from '../services/auth.service'

const colors = {
    yellow: "#ECFF00",
    grey: "#a9a9a9"
}
const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
}
  
function Resenas(){
    const stars = Array(5).fill(0);
    const [Estrellas, setEstrellas] = useState(0);
    const [hoverValue, setHoverValue] =useState();
    //const [api, setApi] = useState();
    const [comentario, setComentario] = useState("");
    const [tipo, setTipo] = useState("");

    let user = AuthService.getCurrentUser(); 

    const handleClick = value => {
        setEstrellas(value)
        if(value <= 2){
            setTipo("Pésimo Servicio")
        }
        else {
            setTipo("Excelente servicio")
        }
    };

    const handleMouseOver = value => {
        setHoverValue(value)
    };

    const handleMouseLeave = ()  => {
        setHoverValue(undefined)
    }

    const sendResena = async()  => {
        const resena = {
            user: user.name,
            comment: comentario,
            stars: Estrellas,
            type: tipo
    }

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let resp = await fetch('http://localhost:8080/reviews',
    {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(resena)
    })
    if(resp){
        Swal.fire({
            icon: 'success',
            title: '¡Tu Comentario se envió con éxito!',
        })
        .then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              
              setEstrellas(0);  
              setComentario("");
              setTipo("");
            }
        })
    }
    else {
        Swal.fire({
            icon: 'error',
            title: '¡Ah ocurrido un error inesperado!',
        })
    }
}
return (
    <Container fluid>
        <Row className="d-flex justify-content-center align-items-center">
            <Card style={{ width: '50%', padding: "0"}} className="m-3">
                <Card.Header className='text-center bg-dark text-white' style={{width: "100%"}}>Nos importa tu comentario</Card.Header>
                <Card.Body>
                    <Form className='text-center'>
                        <Form.Group className="mb-3" controlId="user">
                            <Form.Label>Nombre de Usuario</Form.Label>
                            <Form.Control value={user.name} name="user.name"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="stars">
                        <Row>
                            <Form className='text-center'>
                                <div style={styles.stars}>
                                    {stars.map((_, index) => {
                                        return (
                                            <FaStar
                                            key={index}
                                            size={30}
                                            style={{
                                                marginRight: 10,
                                                cursor: "pointer"
                                            }}
                                            color={(hoverValue || Estrellas) > index ? colors.yellow : colors.grey}
                                            onClick={() => handleClick(index + 1)}
                                            onMouseOver={() => handleMouseOver(index + 1)}
                                            onMouseLeave={handleMouseLeave}
                                            totalStars={stars}
                                            />
                                        )
                                    })}
                                </div>
                            </Form>
                        </Row>
                        <Row>
                            <Form>
                                aqui va el tipo
                            </Form>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" controlId="comentario">
                                <Form.Label>¿Qué te parecio la subasta?</Form.Label>
                                <Form.Control as="textarea" rows="3" value={comentario} onChange={(event) => setComentario(event.target.value)} />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form>
                                <div className="anonimo">
                                    <input type="checkbox" id="anonimo" name="anonimo" value="anonimo" /> Anónimo
                                </div>
                            </Form>
                        </Row>
                        </Form.Group>
                        <Button variant="primary" type="button" className='btn btn-success text-center' onClick={sendResena}>
                                    Enviar
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Row>
    </Container>
);
};

export default Resenas;