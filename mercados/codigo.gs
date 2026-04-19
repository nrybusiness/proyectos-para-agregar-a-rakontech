function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('POS - Minimercado')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function obtenerCatalogo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("PRODUCTOS_SIN_CODIGO");
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  let catalogo = [];
  
  // Asume que la fila 1 son encabezados
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] !== "") {
      catalogo.push({
        id: data[i][0],
        nombre: data[i][1],
        precio: Number(data[i][2]) || 0,
        categoria: data[i][3]
      });
    }
  }
  return catalogo;
}

function procesarVenta(carrito) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetVentas = ss.getSheetByName("VENTAS");
    const fecha = new Date();
    
    // Prepara los datos para inserción en bloque
    let filasParaInsertar = [];
    
    carrito.forEach(item => {
      let totalItem = item.precio * item.cantidad;
      filasParaInsertar.push([fecha, item.id, item.nombre, item.cantidad, totalItem]);
    });
    
    if (filasParaInsertar.length > 0) {
      const ultimaFila = sheetVentas.getLastRow() + 1;
      sheetVentas.getRange(ultimaFila, 1, filasParaInsertar.length, 5).setValues(filasParaInsertar);
    }
    
    return { success: true, mensaje: "Venta registrada con éxito." };
  } catch (e) {
    return { success: false, mensaje: e.toString() };
  }
}
