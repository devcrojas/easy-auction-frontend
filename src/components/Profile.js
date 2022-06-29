import React, { useState } from 'react'
import "../nav.css"
import NavBarMenu from './NavBarMenu'
import MenuLateral from './MenuLateral';
import { Button, Card, CardContent, Collapse, FormGroup, List, ListItem, Rating, TextField, Typography } from '@mui/material';
import { Container, Row, Col, Image } from 'react-bootstrap'

//import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

function Profile() {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    return (
        <>
            <NavBarMenu></NavBarMenu>
            <Container fluid style={{ background: "#F0F2F5" }}>
                <Row>
                    <Col xs={3} className="sidebarEasy">
                        <MenuLateral></MenuLateral>
                    </Col>
                    <Col xs={9} className="p-5">
                        <Container fluid>
                            <Row>
                                <Col md={12} className="d-flex justify-content-center">
                                    <Card elevation={10} sx={{width: 600 }}>
                                        <CardContent>
                                            <div className="row justify-content-center">
                                                <Image roundedCircle src='profile_cr.jpeg' style={{ width: '10rem' }}></Image>
                                            </div>
                                            <Row style={{ justifyContent: "center" }}>
                                                <Rating name="disabled" value={4} disabled size="large" sx={{ justifyContent: "center" }} />
                                            </Row>
                                            <div className='row'>
                                                <Typography variant="subtitle2" component="div">
                                                    <List dense={true} sx={{ marginTop: 2, padding: 1 }}>
                                                        <ListItem sx={{ justifyContent: "center" }}>
                                                            Cesar Arturo
                                                        </ListItem>
                                                        <ListItem sx={{ justifyContent: "center" }}>
                                                            Rojas Morado
                                                        </ListItem>
                                                        <ListItem sx={{ justifyContent: "center" }}>
                                                            c.rojas@gmail.com
                                                        </ListItem>
                                                    </List>
                                                </Typography>
                                            </div>
                                            <Row className="d-flex justify-content-center">
                                                <Button size="small" onClick={handleExpandClick}
                                                    aria-expanded={expanded}
                                                    aria-label="show more" sx={{ marginBottom: 2 }}>
                                                    Editar Perfil
                                                </Button>
                                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                                    <FormGroup>
                                                        <Row>
                                                            <Col xs={6} className="d-flex justify-content-center">
                                                                <TextField id="name" label="Nombre" variant="outlined" />
                                                            </Col>
                                                            <Col xs={6} className="d-flex justify-content-center">
                                                                <TextField id="firstName" label="Apellidos" variant="outlined" />
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ marginTop: 10 }}>
                                                            <Col xs={6} className="d-flex justify-content-center">
                                                                <TextField id="telefono" label="Telefono" variant="outlined" />
                                                            </Col>
                                                            <Col xs={6} className="d-flex justify-content-center">
                                                                <TextField type="date" id="edad" variant="outlined" />
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ marginTop: 10 }}>
                                                            <Col className="d-flex justify-content-center">
                                                                <TextField type="email" id="email" label="Email" variant="outlined" />
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ marginTop: 10 }}>
                                                            <Col className="d-flex justify-content-center">
                                                                <TextField type="text" id="direction" label="Direccion" variant="outlined" />
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Collapse>
                                            </Row>
                                        </CardContent>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container >
        </>
    )
}

export default Profile
