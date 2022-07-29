/* eslint-disable no-useless-computed-key */
import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Card, CardContent, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import NavBarMenu from './NavBarMenu';
import MenuLateral from './MenuLateral';
import AuthService from '../services/auth.service'
import Chart from 'react-apexcharts'
import pointsService from '../services/points.service';

function AccountStatus(params) {
  const [profile] = useState(AuthService.getCurrentUser().profile);
  const [user] = useState(AuthService.getCurrentUser());
  // Variables de la tabla
  const [dataTable, setDataTable] = useState();
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  // Variable del grafico
  const [chartData, setChartData] = useState({
        series: [{
          name: "Easy Pts.",
          data: [[]]
        }],
        options: {
          chart: {
            id: 'area-datetime',
            type: 'area',
            height: '100%',
            width: '100%',
            zoom: {
              autoScaleYaxis: true
            }
          },
          dataLabels: {
            enabled: false
          },
          markers: {
            size: 0,
            style: 'hollow',
          },
          xaxis: {
            type: 'datetime',
            min: new Date(user.date).getTime(),
            tickAmount: 6,
          },
          tooltip: {
            x: {
              format: 'dd MMM yyyy'
            }
          },
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.9,
              stops: [0, 100]
            }
          },
        },
  });
 
  useEffect(() => {
    getPoints()
  }, [])// eslint-disable-line react-hooks/exhaustive-deps

  // Manejadores para la paginacion
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Funcion para obtener los puntos del usuario
  const getPoints = async() => {
    const puntos = await pointsService.getPointsByUserId(user.id)
    createStatusData(puntos[0]);
  }

  // Funcion para obtener el status de los puntos del usuario
  const createStatusData = (userPoints) => {
    const dataIncrement = [];
    const dataDecrement = [];
    let fullData = [];
    // Inserta datos de los incrementos de cuenta
    userPoints.logsIncrement.forEach(element => {
      let row = {}
      row.date = new Date(element.timestamp)
      row.type = "Incremental"
      row.pointsChanged = element.qty
      row.pointsBefore = (element.qtyFinal - element.qty)
      row.pointsAfter = element.qtyFinal
      dataIncrement.push(row)
    });
    // Inserta datos de los decrementos de cuenta
    userPoints.logsDecrement.forEach(element => {
      let row = {}
      row.date = new Date(element.date)
      row.type = "Decremental"
      row.pointsChanged = element.decrement
      row.pointsBefore = element.beforeDecrement
      row.pointsAfter = element.afterDecrement
      dataDecrement.push(row)
    });
    // Uno ambos logs
    const allData = dataIncrement.concat(dataDecrement);
    // Si la union de ambos logs tiene algo
    if(allData){
      // Ordeno toda la informacion descendentemente por fecha
      fullData = allData.sort((a, b) => { return a.date - b.date; });
    }
    const graphData = [];
    // Agrega datos iniciales
    graphData.push([new Date(user.date).getTime(),0])
    // Rellena con los demas datos
    fullData.forEach(element => {
      graphData.push([element.date.getTime(),element.pointsAfter])
    });
    // Le paso los datos iniciales
    setChartData({...chartData,
    ['series']: [{
          'name': "Easy Pts.",
          'data': graphData
        }]
    })
    // Obtengo los datos para la tabla
    const sortData = fullData.reverse();
    setDataTable(sortData);
  }
  // Genero la informacion de la tabla
  const insertDataTable = () => {
    let rows = <></>
    if(dataTable){
      rows = dataTable.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
        return (
          <TableRow key={row.date.getTime()} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} style={(row.type === 'Incremental') ? {backgroundColor: "#ADFFA0"}:{backgroundColor: "#FFA0A0"}}>
            <TableCell align="center">{row.date.toLocaleString()}</TableCell>
            <TableCell align="center">{row.type}</TableCell>
            <TableCell align="center">{row.pointsChanged}</TableCell>
            <TableCell align="center">{row.pointsBefore}</TableCell>
            <TableCell align="center">{row.pointsAfter}</TableCell>
          </TableRow> 
        )
      })
    }
    return rows;
  }

    return (
    <>
      <NavBarMenu user={user.profile} ></NavBarMenu>
      <Container fluid style={{ background: "#F0F2F5",  minHeight: "100vh" }}>
        <Row>
          <Col id="sidebarEasy" xs={3} style={{position:"fixed", width:"25%"}} className="sidebarEasy">
            <MenuLateral view={""} imgProfile={profile.file}></MenuLateral>
          </Col>
          <Col xs={9} style={{width:"75%", marginLeft:"25%"}}>
            <Card className='my-3' sx={{ width:'100%', borderRadius: 5 }} elevation={10}>
                <CardContent>
                  <Row>
                    <Col xs={12} className='mt-4'>
                      <div className="text-center">
                          <div><h4>Historial de puntos</h4></div>
                      </div>
                    </Col>
                  </Row>
                  <Row className='mt-2'>
                    <Col className='d-flex justify-content-center'>
                      <Chart options={chartData.options} series={chartData.series} type="line" width={'100%'} height={300} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} className='mt-4'>
                      <div className="text-center">
                          <div><h4>Estado de cuenta</h4></div>
                      </div>
                    </Col>
                  </Row>
                  <Row xs={12} className='mt-2'>
                    <Col>
                      <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={(dataTable) ? dataTable.length:0}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow style={{backgroundColor: "#f6f6f5"}}>
                              <TableCell align="center">Fecha</TableCell>
                              <TableCell align="center">Tipo</TableCell>
                              <TableCell align="center">Cambio de pts.</TableCell>
                              <TableCell align="center">Pts.Antes</TableCell>
                              <TableCell align="center">Pts.Despues</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                             <>{ insertDataTable() }</>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Col>
                  </Row>
                </CardContent>
            </Card>

          </Col>
        </Row>
      </Container>
    </>
    )
}

export default AccountStatus