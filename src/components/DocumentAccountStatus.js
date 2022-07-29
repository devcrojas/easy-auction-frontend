import React, { useEffect, useState } from 'react'
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from "@react-pdf/renderer";
import AuthService from '../services/auth.service'
import pointsService from '../services/points.service';

function DocumentAccountStatus(){
  
  const [user] = useState(AuthService.getCurrentUser());
  const [fullLogData, setFullLogData] = useState();
  const [actualUserPoints, setActualUserPoints] = useState();
 
  useEffect(() => {
    getPoints()
  }, [])// eslint-disable-line react-hooks/exhaustive-deps

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
  // Genero la informacion de la tabla
  const dataTable = () => {
    let rows = <></>
    if(fullLogData){
      rows = fullLogData.map((row) => {
        return (
          <View style={(row.type === 'Incremental') ? styles.tableRowIncrement : styles.tableRowDecrement}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{row.date.toLocaleString()}</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{row.type}</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{row.pointsChanged}</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{row.pointsBefore}</Text> 
            </View>
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{row.pointsAfter}</Text> 
            </View> 
          </View> 
        )
      })
    }
    return rows;
  }

  // Crea los estilos para el pdf
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
      imageLogo: {
        width: '80pt',
        marginLeft: 5
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

      table: { 
        display: "table", 
        width: "auto", 
        borderStyle: "solid", 
        borderWidth: 1, 
        borderRightWidth: 0, 
        borderBottomWidth: 0 
      }, 
      tableRow: { 
        margin: "auto", 
        flexDirection: "row" 
      },
      tableRowIncrement: { 
        backgroundColor: "#B6FFA4",
        margin: "auto", 
        flexDirection: "row" 
      },
      tableRowDecrement: { 
        backgroundColor: "#FFA4A4",
        margin: "auto", 
        flexDirection: "row" 
      }, 
      tableCol: { 
        width: "20%", 
        borderStyle: "solid", 
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderTopWidth: 0 
      }, 
      tableCell: { 
        margin: "auto", 
        marginTop: 5, 
        fontSize: 10 
      }
  });

  return (
    <PDFViewer style={styles.viewer}>
      {/* Start of the document*/}
      <Document title={'Estado de cuenta del usuario '+user.name}>
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
          <Text style={styles.title}>Estado de cuenta</Text>

          {/* Tabla con datos */}
          <View style={styles.table}> 
            {/* TableHeader */} 
            <View style={styles.tableRow}> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>Fecha</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>Tipo</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>Cambio de pts.</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>Pts.Antes</Text> 
              </View>
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>Pts.Despues</Text> 
              </View> 
            </View> 
            {/* TableContent */} 
            <> { dataTable() } </>
          </View>

        </Page>
      </Document>
    </PDFViewer>
  )
}

export default DocumentAccountStatus