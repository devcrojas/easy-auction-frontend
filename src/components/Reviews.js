import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Button, Row, Card, Form } from "react-bootstrap";
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
  
function Reviews(){
    const stars = Array(5).fill(0);
    const [estrellas, setEstrellas] = useState(0);
    const [hoverValue, setHoverValue] =useState();
    //const [api, setApi] = useState();
    const [comentario, setComentario] = useState("");
    const [tipo, setTipo] = useState("");
    const [user, setUser] = useState();

    useEffect(() => {setUser(AuthService.getCurrentUser)}, [])

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

    const sendReview = async()  => {
        const resena = {
            name: user.name,
            comment: comentario,
            stars: estrellas,
            type: tipo,
            seller: "Sarai"
            
    }

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    console.log(resena);
    let resp = await fetch('http://localhost:8080/reviews/',
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
    <Container fluid = "true">
        <Row className="justify-content-center align-items-center">
            <Card style={{ width: '50%', padding: "0"}} className="m-3">
                <Card.Header className='text-center bg-dark text-white' style={{width: "100%"}}>Cuéntanos como te fue</Card.Header>
                <Card.Body>
                    <Form className='text-center'>
                        <Form.Group className="mb-3" controlId="stars">
                        <Row>
                            <Form.Group className='text-center'>
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
                                            color={(hoverValue || estrellas) > index ? colors.yellow : colors.grey}
                                            onClick={() => handleClick(index + 1)}
                                            onMouseOver={() => handleMouseOver(index + 1)}
                                            onMouseLeave={handleMouseLeave}
                                            
                                            />   
                                        )
                                    }
                                    )}
                                </div>

                            </Form.Group>
                        </Row>
                        <Row>&nbsp;</Row>
                        <Row>
                            <Form.Group>
                                <Form.Control className='text-center bg-danger text-white' value={tipo} onChange={(handleClick) => setTipo()} disabled/>
                            </Form.Group>
                        </Row>
                        <Row>&nbsp;</Row>
                        <Row>
                            <Form.Group className="mb-3" controlId="comentario">
                                <Form.Label>¿Qué te parecio la subasta?</Form.Label>
                                <Form.Control as="textarea" rows="3" value={comentario} onChange={(event) => setComentario(event.target.value)} />
                            </Form.Group>
                        </Row>
                        <Row>&nbsp;</Row>
                        </Form.Group>
                        <Button variant="primary" type="button" className='btn btn-success text-center' onClick={() => {sendReview(); console.log(user)}}>
                                    Enviar
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Row>
    </Container>

)

}

export default Reviews;