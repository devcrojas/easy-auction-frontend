import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { ButtonGroup, Table, TableCell, TableContainer, TableHead, TableRow, Button, TableBody } from '@mui/material';

import "../../nav.css"
import NavBarMenu from '../NavBarMenu'
import MenuLateral from './MenuLateralAdmin';

import AuthService from '../../services/auth.service';
import Swal from 'sweetalert2';


function ProductsAdmin() {
    const [user] = useState(AuthService.getCurrentUser());
    const [profile] = useState(AuthService.getCurrentUser().profile);
    const [inactiveProds, setInactiveProds] = useState([])
    useEffect(() => {
        getProductosInactive();
    }, [])// eslint-disable-line react-hooks/exhaustive-deps
    async function getProductosInactive() {
        let produc = await fetch("/api/products",
            {
                method: "GET"
            }
        );
        let response = await produc.json();
        setInactiveProds(response.filter(producto => producto.status === 'inactive'));
    }
    const buttons = (id) => {
        return (
            <>
                <ButtonGroup variant="text">
                    <Button onClick={() => { autorizarSubasta(id) }}>Autorizar</Button>
                    <Button>Rechazar</Button>
                </ButtonGroup>
            </>
        );
    }
    const generateTable = () => {
        if (inactiveProds !== []) {
            return inactiveProds.map(((pro, index) => {
                return (
                    <TableRow key={index}>
                            <TableCell align={"right"} style={{ minWidth: 170 }}>{pro.nameProduct}</TableCell>
                            <TableCell align={"right"} style={{ minWidth: 170 }}>{pro.category}</TableCell>
                            <TableCell align={"right"} style={{ minWidth: 170 }}>{pro.price.initialP}</TableCell>
                            <TableCell align={"right"} style={{ minWidth: 170 }}>{pro.price.buyNow}</TableCell>
                            <TableCell align={"right"} style={{ minWidth: 170 }}>{buttons(pro._id)}</TableCell>
                    </TableRow>
                )
            }));

        } else {
            return <TableRow><TableCell align={"right"} style={{ minWidth: 170 }}>Cargando datos...</TableCell></TableRow>
        }
    }
    async function autorizarSubasta(id) {
        console.log(id);
        let options = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "status": "active" })
        }
        let resp = await fetch(`/api/products/status/${id}`, options)
        let response = await resp.json();
        console.log(response);
        if (response.status === 1) {
            console.log(response)
            Swal.fire(
                'Subasta Autorizada con exito!',
                'success'
            );
        } else {
            Swal.fire(
                'Error al autorizar subasta!',
                `${resp.mssg}`,
                'error'
            );
        }
    }
    return (
        <>
            <NavBarMenu view={"Admin"}></NavBarMenu>
            <Container fluid style={{ background: "#F0F2F5" }}>
                <Row>
                    <Col xs={3} className="sidebarEasy">
                        <MenuLateral view={"productsAdmin"} profileImg={profile.file}></MenuLateral>
                    </Col>
                    <Col xs={9} className="p-2">
                        <Container fluid>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align={"right"} style={{ minWidth: 170 }}>Producto</TableCell>
                                            <TableCell align={"right"} style={{ minWidth: 170 }}>Categoria</TableCell>
                                            <TableCell align={"right"} style={{ minWidth: 170 }}>Precio inicial</TableCell>
                                            <TableCell align={"right"} style={{ minWidth: 170 }}>Comprar ahora</TableCell>
                                            <TableCell align={"center"} style={{ minWidth: 170 }}>Autorizar</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        {
                                            generateTable()
                                        }

                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </Container>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default ProductsAdmin