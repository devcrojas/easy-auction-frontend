import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { ButtonGroup, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, IconButton, tableCellClasses } from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';


import "../../nav.css"
import NavBarMenu from '../NavBarMenu'
import MenuLateral from './MenuLateralAdmin';

import AuthService from '../../services/auth.service';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-material-ui/material-ui.css'
import { styled } from '@mui/material/styles';


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

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.white,
            color: theme.palette.common.black,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,

        },
    }));
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const generateTable = () => {
        if (inactiveProds !== []) {
            return inactiveProds.map(((pro, index) => {
                return (

                    <StyledTableRow key={index} id={pro._id}>
                        <StyledTableCell align={"center"} ><img style={{ width: "100%", height: 100, border: 5 }} className="justify-content-center" src={`\\${pro.file.filePath}`} alt={pro.nameProduct} /></StyledTableCell>
                        <StyledTableCell align={"center"} >{pro.nameProduct}</StyledTableCell>
                        <StyledTableCell align={"center"} >{pro.category}</StyledTableCell>
                        <StyledTableCell align={"center"} >{pro.price.initialP}</StyledTableCell>
                        <StyledTableCell align={"center"} >{pro.price.buyNow}</StyledTableCell>
                        <StyledTableCell align={"center"} >{buttons(pro._id)}</StyledTableCell>
                    </StyledTableRow>
                )
            }));

        } else {
            return <TableRow><TableCell align={"right"} style={{ minWidth: 170 }}>Cargando datos...</TableCell></TableRow>
        }
    }

    async function cambiarEstadoSubasta(id, status) {
        if (status === 'active') {
            let response = await createFeatch(status, id);
            console.log(response);
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
            }).then(async(result) => {
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
            let options = {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "status": status })
            }
            let resp = await fetch(`/api/products/status/${id}`, options)
            if(resp.status === 200){
                resolve(resp)
            }else{
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
                        <Container fluid >
                            <TableContainer className="responsive">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align={"center"} style={{ minWidth: 170 }}>Imagen</TableCell>
                                            <TableCell align={"center"} style={{ minWidth: 170 }}>Producto</TableCell>
                                            <TableCell align={"center"} style={{ minWidth: 170 }}>Categoria</TableCell>
                                            <TableCell align={"center"} style={{ minWidth: 170 }}>Precio inicial</TableCell>
                                            <TableCell align={"center"} style={{ minWidth: 170 }}>Comprar ahora</TableCell>
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