import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { ButtonGroup, IconButton, Tooltip, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import "../../nav.css"
import NavBarMenu from '../NavBarMenu'
import MenuLateral from './MenuLateralAdmin';

import AuthService from '../../services/auth.service';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-material-ui/material-ui.css'



function ProductsAdmin() {
    const [user] = useState(AuthService.getCurrentUser());
    const [profile] = useState(AuthService.getCurrentUser().profile);
    const [inactiveProds, setInactiveProds] = useState([]);
    //Constantes para paginacion
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

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
    //Constantes par paginacion
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const buttons = (id) => {
        return (
            <>
                <ButtonGroup variant="text">
                    <Tooltip title="Autorizar subasta">
                        <IconButton aria-label="check" size="large" color="success" onClick={() => { cambiarEstadoSubasta(id, 'active') }} >
                            <CheckCircleOutlineOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Rechazar subasta">
                        <IconButton aria-label="clear" size="large" color="error" onClick={() => { cambiarEstadoSubasta(id, 'rechazed') }} >
                            <HighlightOffOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </ButtonGroup>
            </>
        );
    }
    
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
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
            return inactiveProds.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(((pro, index) => {
                let fechaInicio = new Date(pro.auctionDate.create).toLocaleDateString();
                return (
                    <StyledTableRow key={index} id={pro._id}>
                        <StyledTableCell align={"center"} className="table-primary" style={{ width: 175, height: 175, border: 5,backgroundColor:"#A6D1E6" }} ><img style={{ width: "100%", height: "100%", border: 5 }} className="justify-content-center" src={`\\${pro.file.filePath}`} alt={pro.nameProduct} /></StyledTableCell>
                        <StyledTableCell align={"center"} >{pro.nameProduct}</StyledTableCell>
                        <StyledTableCell align={"center"} >{pro.category}</StyledTableCell>
                        <StyledTableCell align={"center"} >{fechaInicio}</StyledTableCell>
                        <StyledTableCell align={"center"} >${pro.price.initialP}</StyledTableCell>
                        <StyledTableCell align={"center"} >${pro.price.buyNow}</StyledTableCell>
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
            console.log(dateAuthProd.toLocaleDateString());
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
            <Container fluid style={{ background: "#F0F2F5", minHeight: "100vh" }}>
                <Row>
                    <Col id="sidebarEasy" xs={3} style={{ position: "fixed", width: "25%" }} className="sidebarEasy">
                        <MenuLateral view={""} imgProfile={profile.file}></MenuLateral>
                    </Col>
                    <Col xs={9} style={{width:"75%", marginLeft:"25%"}} className="p-2 h-25">
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={inactiveProds.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        <TableContainer sx={{ maxHeight: "60%" }} >
                            <Table>
                                <TableHead align={"center"} size="small" style={{backgroundColor:"#A6D1E6"}}>
                                    <TableRow >
                                        <TableCell align={"center"} style={{ minWidth: "75%" }}>Imagen</TableCell>
                                        <TableCell align={"center"} style={{ minWidth: "75%" }}>Producto</TableCell>
                                        <TableCell align={"center"} style={{ minWidth: "75%" }}>Categoria</TableCell>
                                        <TableCell align={"center"} style={{ minWidth: "75%" }}>Fecha creación</TableCell>
                                        <TableCell align={"center"} style={{ minWidth: "75%" }}>Precio inicial</TableCell>
                                        <TableCell align={"center"} style={{ minWidth: "75%" }}>Comprar ahora</TableCell>
                                        <TableCell align={"center"} style={{ minWidth: "75%" }}>Autorizar</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>

                                    {
                                        generateTable()
                                    }

                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Col>
                </Row>
            </Container>
        </>
        
    )
}

export default ProductsAdmin