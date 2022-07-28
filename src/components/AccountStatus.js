import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Card, CardContent, Button } from '@mui/material';
import NavBarMenu from './NavBarMenu';
import MenuLateral from './MenuLateral';
import AuthService from '../services/auth.service'
import Chart from 'react-apexcharts'
import axios from 'axios';

function AccountStatus(params) {
  const [profile] = useState(AuthService.getCurrentUser().profile);
  const [user] = useState(AuthService.getCurrentUser());

  let graph;

  const [chartData, setChartData] = useState({
        series: [{
          name: "Easy Pts.",
          data: [[]]
        }],
        options: {
          chart: {
            id: 'area-datetime',
            type: 'area',
            height: 350,
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
  }, [])

  // Funcion para obtener los puntos del usuario
  const getPoints = async() => {
    let resp;
    resp = await axios.get("/api/points/"+user.id,{
              headers: { 'Content-Type': 'application/json',"Authorization": "Bearer " + localStorage.getItem("token")}
    });
    console.log('resp',resp);
    if(resp.status === 200){
      await createStatusData(resp.data[0]);
    }
  }

  // Funcion para obtener el status de los puntos del usuario
  const createStatusData = (userPoints) => {
    const dataIncrement = [];
    const dataDecrement = [];
    let fullData = [];
    console.log('userPoints',userPoints)
    // Inserta datos de los incrementos de cuenta
    userPoints.logsIncrement.forEach(element => {
      let row = {}
      row.date = new Date(element.timestamp)
      row.pointsAfter = element.qtyFinal
      dataIncrement.push(row)
    });
    // Inserta datos de los decrementos de cuenta
    userPoints.logsDecrement.forEach(element => {
      let row = {}
      row.date = new Date(element.date)
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
    chartData.series[0].data = graphData

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
                  <Row xs={12} className='mt-2'>
                    <Col className='d-flex justify-content-center'>
                      <Chart options={chartData.options} series={chartData.series} type="line" width={500} height={320} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} className='d-flex justify-content-center'>
                      <Button variant="contained" color="primary" href='/documentAccountStatus' target='_blank'>
                          Descargar estado de cuenta
                      </Button>
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