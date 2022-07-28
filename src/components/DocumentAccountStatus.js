import React, { useEffect, useState } from 'react'
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from "@react-pdf/renderer";
import AuthService from '../services/auth.service'
import { TableHeader, Table, TableCell, TableBody, DataTableCell } from '@david.kucsai/react-pdf-table';
import axios from 'axios';


function DocumentAccountStatus(){
  
  const [user] = useState(AuthService.getCurrentUser());
  const [fullLogData, setFullLogData] = useState();
  const [actualUserPoints, setActualUserPoints] = useState();
 
  useEffect(() => {
    getPoints()
  }, [])

  // Funcion para obtener los puntos del usuario
  const getPoints = async() => {
    let resp;
    resp = await axios.get("/api/points/"+user.id,{
              headers: { 'Content-Type': 'application/json',"Authorization": "Bearer " + localStorage.getItem("token")}
    });
    if(resp.status === 200){
      await createStatusData(resp.data[0]);
    }
  }

  // Funcion para obtener el status de los puntos del usuario
  const createStatusData = (userPoints) => {
    const dataIncrement = [];
    const dataDecrement = [];
    let fullData = [];
    // console.log('userPoints',userPoints)
    // Obtengo los puntos actuales del usuario
    setActualUserPoints(userPoints.pts);
    // Si existen logs increments
    if(userPoints.logsIncrement){
      // Inserta datos de los incrementos de cuenta
      userPoints.logsIncrement.forEach(element => {
        // Si existe un detalle de paypal
        let row = {}
        row.date = new Date(element.timestamp)
        row.type = "Incremental"
        row.pointsChanged = element.qty + ' Pts.'
        row.pointsBefore = (element.qtyFinal - element.qty) + ' Pts.'
        row.pointsAfter = element.qtyFinal + ' Pts.'
        dataIncrement.push(row)
      });
    }
    // Si existen logs decrements
    if(userPoints.logsDecrement){
      // Inserta datos de los decrementos de cuenta
      userPoints.logsDecrement.forEach(element => {
        let row = {}
        row.date = new Date(element.date)
        row.type = "Decremental"
        row.pointsChanged = element.decrement + ' Pts.'
        row.pointsBefore = element.beforeDecrement + ' Pts.'
        row.pointsAfter = element.afterDecrement + ' Pts.'
        dataDecrement.push(row)
      });
    }
    // Uno ambos logs
    const allData = dataIncrement.concat(dataDecrement);
    // Si la union de ambos logs tiene algo
    if(allData){
      // Ordeno toda la informacion ascendentemente por fecha
      const dataSorted = allData.sort((a, b) => { return a.date - b.date; });
      fullData = dataSorted.reverse();
    }
    // Asigno la informacion a la data de la tabla
    setFullLogData(fullData);
  }

  // Create styles
  const styles = StyleSheet.create({
      body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
      },
      title: {
        fontSize: 24,
        textAlign: 'center'
      },
      table: {
        paddingTop: 35,
        marginVertical: 15,
        marginHorizontal: 100,
      },
      viewer: {
        width: window.innerWidth, //the pdf viewer will take up all of the width and height
        height: window.innerHeight,
      },
      userContainer: {
        backgroundColor: "#f6f6f5",
        display: "flex",
        flexDirection: "row",
        borderWidth: 2,
        padding: 5
      },
      image: {
        width: '80pt',
        border:'5pt',
        borderWidth:'5pt'
      },
      userDetails: {
        display: "flex",
        marginLeft: 5
      },
      userName: {
        fontSize: 15,
        marginBottom: 10
      },
      rowContainer: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12
      },
      dataRow: {
        display: "flex",
        flexDirection: "row"
      },
      rowText: {
        fontSize: 15
      },
  });

  return (
    <PDFViewer style={styles.viewer}>
      {/* Start of the document*/}
      <Document title={'Detalle de cuenta del usuario '+user.name}>
        {/*render a single page*/}
        <Page size="A4" style={styles.body}>
          {/* Detalle del usuario */}
          <View style={styles.userContainer}>
            <Image style={styles.image} src={"/" + user.profile.file.filePath}/>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Usuario: {user.profile.firstName +' '+ user.profile.lastName}</Text>
              <View style={styles.rowContainer}>
                <View style={styles.dataRow}>
                  <Text style={styles.rowText}>Puntos actuales: {actualUserPoints} Easy Pts.</Text>
                </View>
              </View>
              <View style={styles.rowContainer}>
                <View style={styles.dataRow}>
                  <Text style={styles.rowText}>Email: {user.profile.email}</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Tabla con datos */}
          <Text style={styles.title}>Estado de cuenta</Text>
          <Table data={fullLogData} style={styles.table}>
            <TableHeader textAlign={"center"}>
                <TableCell>
                    Fecha
                </TableCell>
                <TableCell>
                    Tipo
                </TableCell>
                <TableCell>
                    Cambio de pts.
                </TableCell>
                <TableCell>
                    Pts.Antes
                </TableCell>
                <TableCell>
                    Pts.Despues
                </TableCell>
            </TableHeader>
            <TableBody textAlign={"center"}>
                <DataTableCell getContent={(r) => r.date.toLocaleString()}/>
                <DataTableCell getContent={(r) => r.type}/>
                <DataTableCell getContent={(r) => r.pointsChanged}/>
                <DataTableCell getContent={(r) => r.pointsBefore}/>
                <DataTableCell getContent={(r) => r.pointsAfter}/>
            </TableBody>
          </Table>
        </Page>
      </Document>
    </PDFViewer>
  )
}

export default DocumentAccountStatus