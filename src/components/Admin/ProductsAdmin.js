import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { ButtonGroup, IconButton } from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';


import "../../nav.css"
import NavBarMenu from '../NavBarMenu'
import MenuLateral from './MenuLateralAdmin';

import AuthService from '../../services/auth.service';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-material-ui/material-ui.css'
import Table from 'react-bootstrap/Table';


function ProductsAdmin() {
    const [user] = useState(AuthService.getCurrentUser());

    const [profile] = useState(AuthService.getCurrentUser().profile);
    const [inactiveProds, setInactiveProds] = useState([]);
    useEffect(() => {
        getProductosInactive();
    }, [])// eslint-disable-line react-hooks/exhaustive-deps
    async function getProductosInactive() {
        let produc = await fetch("/api/products/all/products",
            {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }

            }
        );
        let response = await produc.json();
        setInactiveProds(response.filter(producto => producto.status === 'inactive'));
    }
    const buttons = (id) => {
        return (
            <>
                <ButtonGroup variant="text">
                    <IconButton aria-label="check" size="large" color="success" onClick={() => { cambiarEstadoSubasta(id, 'active') }} >
                        <CheckCircleOutlineOutlinedIcon />
                    </IconButton>
                    <IconButton aria-label="clear" size="large" color="error" onClick={() => { cambiarEstadoSubasta(id, 'rechazed') }} >
                        <HighlightOffOutlinedIcon />
                    </IconButton>
                </ButtonGroup>
            </>
        );
    }

    const generateTable = () => {
        if (inactiveProds !== []) {
            return inactiveProds.map(((pro, index) => {
                return (
                    <tr key={index} id={pro._id}>
                        <td align={"right"} className="table-primary" ><img style={{ width: "100%", height: 100, border: 5 }} className="justify-content-center" src={`\\${pro.file.filePath}`} alt={pro.nameProduct} /></td>
                        <td align={"center"} >{pro.nameProduct}</td>
                        <td align={"center"} >{pro.category}</td>
                        <td align={"center"} >{pro.price.initialP}</td>
                        <td align={"center"} >{pro.price.buyNow}</td>
                        <td align={"center"} >{buttons(pro._id)}</td>
                    </tr>
                )
            }));

        } else {
            return <tr><td align={"right"} style={{ minWidth: 170 }}>Cargando datos...</td></tr>
        }
    }

    async function cambiarEstadoSubasta(id, status) {
        if (status === 'active') {
            let response = await createFeatch(status, id);
            //console.log(response);
            if (response.status === 200) {
                Swal.fire(
                    '¡Subasta Autorizada con exito!',
                    '¡Ahora la subasta esta publicada!',
                    'success'
                );
                let row = document.getElementById(id);
                row.style.display = "none";
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error con la subasta!',
                    text: `${response.message}`
                });
            }
        } else if (status === 'rechazed') {
            Swal.fire({
                title: '¿Estas seguro de rechazar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si!',
                cancelButtonText: 'No',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let response = await createFeatch(status, id);
                    if (response.status === 200) {
                        Swal.fire(
                            '¡Rechazado!'
                        )
                        let row = document.getElementById(id);
                        row.style.display = "none";
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error con la subasta!',
                            text: `${response.message}`
                        });
                    }
                }
            })
        }
    }

    function createFeatch(status, id) {

        return new Promise(async function (resolve, reject) {
            let dateAuthProd = new Date()
            let options = {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("token")
                },
                body: JSON.stringify({
                    "status": status,
                    "adminAuth": user.id,
                    "dateAuthProd": dateAuthProd
                })
            }
            let resp = await fetch(`/api/products/auctionauth/${id}`, options)
            if (resp.status === 200) {
                resolve(resp)
            } else {
                reject(resp.message)
            }
        });
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
                        <Container fluid className="table-responsive" >
                            <Table striped bordered>
                                <thead align={"center"} className="table-primary" >
                                    <tr>
                                        <th align={"center"}  style={{ minWidth: 170 }}>Imagen</th>
                                        <th align={"center"} style={{ minWidth: 170 }}>Producto</th>
                                        <th align={"center"} style={{ minWidth: 170 }}>Categoria</th>
                                        <th align={"center"} style={{ minWidth: 170 }}>Precio inicial</th>
                                        <th align={"center"} style={{ minWidth: 170 }}>Comprar ahora</th>
                                        <th align={"center"} style={{ minWidth: 170 }}>Autorizar</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        generateTable()
                                    }

                                </tbody>
                            </Table>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default ProductsAdmin