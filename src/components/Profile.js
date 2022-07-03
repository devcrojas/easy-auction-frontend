import React, { useEffect, useState } from 'react'
import {
    Button, Card, CardContent,
    Fade, Divider, FormGroup,
    List, ListItem, ListItemText,
    Rating, TextField, Typography,
    Input, IconButton, Badge
} from '@mui/material';
import { Container, Row, Col, Image, Form } from 'react-bootstrap';

import AuthService from '../services/auth.service';
import axios from 'axios';

import NavBarMenu from './NavBarMenu'
import MenuLateral from './MenuLateral';
import "../nav.css"

import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

//import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
function Profile() {
    const [user, setUser] = useState({});
    const [expanded, setExpanded] = useState(false);
    const [profile, setProfile] = useState({
        _id: "",
        firstName: "",
        lastName: "",
        birthday: "",
        address: { cpp: "", street: "", suburb: "", municipaly: "", state: "" },
        phone: "",
        email: "",
        status: "",
        file: {
            fileName: "",
            filePath: "",
            fileType: "",
            fileSize: ""
        }
    });
    const [upProfile, setUpProfile] = useState({})
    useEffect(() => {
        setUser(AuthService.getCurrentUser());
    }, []);
    useEffect(() => {
        if (user.profile) {
            setProfile(user.profile)
            console.log(user.profile);
        }
    }, [user])
    const handleInputChange = (event) => {
        setUpProfile({
            ...upProfile,
            [event.target.name]: event.target.value
        })
    }
    /* const handleInputChangeAddress = (event) => {
        switch (event.target.name) {
            case "cpp":
                profile.address.cpp = event.target.value
                break;
            case "street":
                profile.address.street = event.target.value
                break;
            case "state":
                profile.address.state = event.target.value
                break;
            case "municipaly":
                profile.address.municipaly = event.target.value
                break;
            case "suburb":
                profile.address.suburb = event.target.value
                break;
            default:
                break
        }
    } */
    const handleInputImage = async (event) => {
        let formData = new FormData();
        formData.append("file", event.target.files[0]);
        let resp = await axios.put(`http://localhost:8080/profiles/${user.id}`, formData);
    }
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    async function sendUpProfile() {
        let formData = new FormData();
        formData.append("profile", upProfile);
        console.log(upProfile)
        let resp = await axios.put(`http://localhost:8080/profiles/${user.id}`, formData);

    }
    return (
        <>
            <NavBarMenu></NavBarMenu>
            <Container fluid style={{ background: "#F0F2F5" }}>
                <Row>
                    <Col xs={3} className="sidebarEasy">
                        <MenuLateral></MenuLateral>
                    </Col>
                    <Col xs={9} className="p-2">
                        <Container fluid>
                            <Row>
                                <Col xs={12}>
                                    <Card elevation={10} sx={{ borderRadius: 5 }}>
                                        <CardContent>
                                            <Row>
                                                <Col md={7}>
                                                    <Row className="justify-content-center">
                                                        <Col xs={12} className="justify-content-center">
                                                            <Form encType='multipart/form-data'>
                                                                <Badge
                                                                    overlap="circular"
                                                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                                    badgeContent={
                                                                        <label htmlFor="icon-button-file">
                                                                            <Input accept="image/*" name="file" id="icon-button-file" type="file" hidden onChange={handleInputImage} />
                                                                            <IconButton aria-label="upload picture" component="span">
                                                                                <AddPhotoAlternateIcon />
                                                                            </IconButton>
                                                                        </label>
                                                                    }>
                                                                    <Image roundedCircle src={`http://localhost:8080\\${profile.file !== undefined ? profile.file.filePath : 'uploads\\noUserImage.jpg'}`} style={{ width: '8rem' }}></Image>
                                                                </Badge>
                                                            </Form>
                                                        </Col>
                                                        <Rating name="disabled" value={4} disabled sx={{ justifyContent: "center" }} />
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <Typography variant="body2" component="div">
                                                                <List dense={true} sx={{ marginTop: 2 }}>
                                                                    <ListItem sx={{ justifyContent: "center" }}>
                                                                        {user.name}
                                                                    </ListItem>
                                                                    <ListItem sx={{ justifyContent: "center" }}>
                                                                        {profile.lastName}
                                                                    </ListItem>
                                                                    <ListItem sx={{ justifyContent: "center" }}>
                                                                        {user.id}
                                                                    </ListItem>
                                                                </List>
                                                            </Typography>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col md={5}>
                                                    <Row className="justify-content-center">
                                                        <Button size="small" onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
                                                            <ModeEditIcon sx={{ marginRight: 1 }} />  Editar Perfil
                                                        </Button>
                                                        <Fade in={!expanded}>
                                                            <Typography component="div" variant="caption" hidden={expanded}>
                                                                <List dense={true} sx={{ marginTop: 2, padding: 1 }}>
                                                                    <Divider textAlign="center">Info. Personal</Divider>
                                                                    <ListItemText primary="Fecha de Nacimiento" secondary={profile.birthday} />
                                                                    <ListItemText primary="Num. Telefonico" secondary={profile.phone} />
                                                                    <Divider textAlign="center">Direccion</Divider>
                                                                    <ListItemText primary="Calle" secondary={profile.address.street !== "" ? profile.address.street : ""} />
                                                                    <ListItemText primary="Colonia" secondary={profile.address.suburb !== "" ? profile.address.suburb : ""} />
                                                                    <ListItemText primary="Municipio / Delegacion" secondary={profile.address.municipaly !== "" ? profile.address.municipaly : ""} />
                                                                    <ListItemText primary="cpp" secondary={profile.address.cpp !== "" ? profile.address.cpp : ""} />
                                                                    <ListItemText primary="Entidad Federativa" secondary={profile.address.state !== "" ? profile.address.state : ""} />
                                                                </List>
                                                            </Typography>
                                                        </Fade>
                                                        <Fade in={expanded} hidden={!expanded}>
                                                            <Form encType="multipart/form-data">
                                                                <FormGroup>
                                                                    <TextField name="firstName" label="Nombre" variant="outlined" onChange={handleInputChange} margin="normal" size="small" required />
                                                                    <TextField name="lastName" label="Apellidos" variant="outlined" onChange={handleInputChange} margin="normal" size="small" required />
                                                                    <Row>
                                                                        <Col xs={6} className="justify-content-center">
                                                                            <TextField name="phone" label="Telefono" variant="outlined" onChange={handleInputChange} margin="normal" size="small" required />
                                                                        </Col>
                                                                        <Col xs={6} className="justify-content-center">
                                                                            <TextField name="birthday" type="date" id="edad" variant="outlined" onChange={handleInputChange} margin="normal" size="small" required />
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col xs={6} className="justify-content-center">
                                                                            <TextField type="text" name="cpp" label="CPP" variant="outlined" onChange={handleInputChange} margin="normal" size="small" max={5} required />
                                                                            <TextField type="text" name="municipaly" label="Delegación/Municipio" variant="outlined" onChange={handleInputChange} margin="normal" size="small" required />
                                                                        </Col>
                                                                        <Col xs={6} className="justify-content-center">
                                                                            <TextField type="text" name="state" label="Estado" variant="outlined" onChange={handleInputChange} margin="normal" size="small" required />
                                                                            <TextField type="text" name="suburb" label="Colonia/Barrio" variant="outlined" onChange={handleInputChange} margin="normal" size="small" required />
                                                                        </Col>
                                                                        <Col xs={12}>
                                                                            <TextField type="text" name="street" label="Calle y numero" variant="outlined" onChange={handleInputChange} margin="normal" size="small" sx={{ width: "100%" }} required />
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col xs={12}>
                                                                            <TextField type="email" name="email" label="Email" variant="outlined" value={user.email} onChange={handleInputChange} margin="normal" sx={{ width: "100%" }} size="small" required />
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col className='d-flex justify-content-center'>
                                                                            <Button variant="contained" color="success" size="medium" name="profile" onClick={sendUpProfile}>Actualizar</Button>
                                                                        </Col>
                                                                    </Row>
                                                                </FormGroup>
                                                            </Form>
                                                        </Fade>
                                                    </Row>
                                                </Col>
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
