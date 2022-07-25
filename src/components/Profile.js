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

import NavBarMenu from './NavBarMenu'
import MenuLateral from './MenuLateral';
import "../nav.css"

import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Swal from 'sweetalert2';

function Profile() {
    const [user] = useState(AuthService.getCurrentUser());
    const [profile, setProfile] = useState(AuthService.getCurrentUser().profile);
    const [expanded, setExpanded] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorEmailText, setErrorEmailText] = useState("");
    useEffect(() => {
        changeImgProf();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleInputChange = (event) => {
        setProfile({
            ...profile,
            [event.target.name]: event.target.value
        });
        if (event.target.name === 'email' && event.target.value !== '') {
            if (validateEmail(event.target.value) === null) {
                setErrorEmail(true);
                setErrorEmailText("introduce un correo valido como: \n easyauction@gmail.com");
            } else {
                setErrorEmail(false);
                setErrorEmailText("");
            }

        } else {
            setErrorEmail(false);
            setErrorEmailText("");
        }
    }
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
    const handleInputChangeAddress = (event) => {
        switch (event.target.name) {
            case "cpp":
                profile.address.cpp = event.target.value
                break;
            case "street":
                profile.address.street = event.target.value
                break;
            case "suburb":
                profile.address.suburb = event.target.value
                break;
            case "municipaly":
                profile.address.municipaly = event.target.value
                break;
            case "state":
                profile.address.state = event.target.value
                break;
            default:
                break;
        }
    }
    const handleInputImage = async (event) => {
        let formData = new FormData();
        formData.append("file", event.target.files[0]);
        let options = {
            method: "PUT",
            body: formData
        }
        let resp = await fetch(`/api/profiles/image/${user.id}`, options)
        if (resp.status === 200) {
            changeImgProf();
            Swal.fire(
                'Fotografia Actualizado!',
                'Seguir navegando',
                'success'
            );
        } else {
            Swal.fire(
                'Error al actualizar perfil!',
                `${resp.error.message}`,
                'error'
            );
        }
    }
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    async function sendUpProfile() {
        if (!errorEmail) {
            let token = localStorage.getItem('token');
            let options = {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "profile": profile })
            }
            let resp = await fetch(`/api/profiles/${user.id}`, options)
            console.log(resp)
            if (resp.status === 201) {
                changeImgProf();
                handleExpandClick()
                Swal.fire(
                    'Perfil Actualizado!',
                    'Seguir navegando',
                    'success'
                );
            } else {
                Swal.fire(
                    'Error al actualizar perfil!',
                    `${resp.error.message}`,
                    'error'
                );
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: "Revisa tu correo electronico",
                text: 'El correo debe tener un formato valido'
            });
        }

    }
    async function changeImgProf() {
        let options = {
            method: "GET"
        }
        let resp = await fetch(`/api/profiles/${user.id}`, options);
        let response = await resp.json();
        setProfile(response)
    }
    let imageProfile = profile.file;
    return (
        <>
            <NavBarMenu view={""} user={user.profile}></NavBarMenu>
            <Container fluid style={{ background: "#F0F2F5", minHeight: "100vh"  }}>
                <Row>
                    <Col xs={3} id="sidebarEasy" className="sidebarEasy" style={{position:"fixed", width:"25%", zIndex:"100000"}}>
                        <MenuLateral view={"MyProfile"} profileImg={imageProfile}></MenuLateral>
                    </Col>
                    <Col xs={9} style={{width:"75%", marginLeft:"25%"}}>
                        <Container fluid>
                            <Row className="mt-5">
                                <Col xs={12}>
                                    <Card elevation={10} sx={{ borderRadius: 5 }}>
                                        <CardContent>
                                            <Row>
                                                <Col md={7}>
                                                    <Row className="justify-content-center">
                                                        <Col xs={12} className=" d-flex justify-content-center">
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
                                                                <Image roundedCircle src={`\\${imageProfile.filePath}`} style={{ width: '8rem' }}></Image>
                                                            </Badge>
                                                        </Col>
                                                        <Rating name="disabled" value={4} disabled sx={{ justifyContent: "center" }} />
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <Typography variant="body2" component="div">
                                                                <List dense={true} sx={{ marginTop: 2 }}>
                                                                    <ListItem sx={{ justifyContent: "center" }}>
                                                                        {profile.firstName}
                                                                    </ListItem>
                                                                    <ListItem sx={{ justifyContent: "center" }}>
                                                                        {profile.lastName}
                                                                    </ListItem>
                                                                    <ListItem sx={{ justifyContent: "center" }}>
                                                                        {(profile.email !== "") ? profile.email : user.id}
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
                                                                    <ListItemText primary="Fecha de Nacimiento" secondary={profile.birthday !== null ? profile.birthday.split('T')[0] : ""} />
                                                                    <ListItemText primary="Num. Telefonico" secondary={profile.phone} />
                                                                    <Divider textAlign="center">Direccion</Divider>
                                                                    <ListItemText primary="Calle" secondary={profile.address.street} />
                                                                    <ListItemText primary="Colonia" secondary={profile.address.suburb} />
                                                                    <ListItemText primary="Municipio / Delegacion" secondary={profile.address.municipaly} />
                                                                    <ListItemText primary="cpp" secondary={profile.address.cpp} />
                                                                    <ListItemText primary="Entidad Federativa" secondary={profile.address.state} />
                                                                </List>
                                                            </Typography>
                                                        </Fade>
                                                        <Fade in={expanded} hidden={!expanded}>
                                                            <Form encType="multipart/form-data">
                                                                <FormGroup>
                                                                    <TextField name="firstName" label="Nombre" variant="outlined" defaultValue={profile.firstName} onChange={handleInputChange} inputProps={{ maxLength: "30" }} margin="normal" size="small" required />
                                                                    <TextField name="lastName" label="Apellidos" variant="outlined" defaultValue={profile.lastName} onChange={handleInputChange} inputProps={{ maxLength: "30" }} margin="normal" size="small" required />
                                                                    <Row>
                                                                        <Col xs={6} className="justify-content-center">
                                                                            <TextField name="phone" label="Telefono" variant="outlined" defaultValue={profile.phone} onChange={handleInputChange} inputProps={{ maxLength: "12" }} margin="normal" size="small" required />
                                                                        </Col>
                                                                        <Col xs={6} className="justify-content-center">
                                                                            <TextField name="birthday" type="date" id="edad" variant="outlined" defaultValue={(profile.birthday) ? profile.birthday.split('T')[0] : ""} onChange={handleInputChange} margin="normal" size="small" required />
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col xs={6} className="justify-content-center">
                                                                            <TextField type="text" name="cpp" label="CPP" variant="outlined" defaultValue={profile.address.cpp} onChange={handleInputChangeAddress} margin="normal" size="small" inputProps={{ maxLength: "5" }} required />
                                                                            <TextField type="text" name="municipaly" label="Delegación/Municipio" variant="outlined" defaultValue={profile.address.municipaly} onChange={handleInputChangeAddress} margin="normal" size="small" required />
                                                                        </Col>
                                                                        <Col xs={6} className="justify-content-center">
                                                                            <TextField type="text" name="state" label="Estado" variant="outlined" defaultValue={profile.address.state} onChange={handleInputChangeAddress} margin="normal" size="small" required />
                                                                            <TextField type="text" name="suburb" label="Colonia/Barrio" variant="outlined" defaultValue={profile.address.suburb} onChange={handleInputChangeAddress} margin="normal" size="small" required />
                                                                        </Col>
                                                                        <Col xs={12}>
                                                                            <TextField type="text" name="street" label="Calle y numero" variant="outlined" defaultValue={profile.address.street} onChange={handleInputChangeAddress} margin="normal" size="small" sx={{ width: "100%" }} required />
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col xs={12}>
                                                                            <TextField type="email" name="email" label="Email"
                                                                                variant="outlined" value={user.email} onChange={handleInputChange}
                                                                                margin="normal" sx={{ width: "100%" }} size="small" required
                                                                                error={errorEmail}
                                                                                helperText={errorEmailText} />
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