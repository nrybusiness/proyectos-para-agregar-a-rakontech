/**
 * @file Code.gs
 * @description Servidor principal del e-commerce de Marco (Suplementos).
 *              Sirve la Web App y expone endpoints de datos como JSON.
 * @version 2.0.0
 * @author Rakon Technology
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN GLOBAL
// ─────────────────────────────────────────────────────────────────────────────

/** @const {Object} CONFIG - Parámetros centrales de la tienda. */
const CONFIG = {
  STORE_NAME: "MARCO",
  TAGLINE: "Suplementos de Alto Rendimiento",
  WHATSAPP_NUMBER: "573001234567",
  INSTAGRAM_HANDLE: "@marco.oficial",
  CURRENCY_SYMBOL: "$",
  FREE_SHIPPING_THRESHOLD: 120000,
};

// ─────────────────────────────────────────────────────────────────────────────
// CATÁLOGO DE PRODUCTOS
// ─────────────────────────────────────────────────────────────────────────────

/** @type {Array} */
const PRODUCTS = [
  {
    id: "gomitas-vinagre",
    name: "Vinagre de Manzana en Gomitas",
    subtitle: "Suplemento Premium · Edición Especial",
    description: "Disfruta los beneficios del vinagre de manzana sin el sabor fuerte ni la incomodidad. Estas gomitas facilitan su consumo diario, ayudándote a mantener una rutina constante sin fricción.",
    rating: 4.8,
    reviewCount: 32,
    stock: 5,
    stockTotal: 100,
    delivery: "miércoles, 25 de marzo",
    priceFull: 123000,
    variants: [
      { label: "1 envase",  qty: 1, price: 85000,  priceUnit: 1400, badge: "" },
      { label: "2 envases", qty: 2, price: 155000, priceUnit: 1300, badge: "Más popular" },
      { label: "3 envases", qty: 3, price: 210000, priceUnit: 1167, badge: "Mejor opción" },
    ],
    benefits: [
      "Usado históricamente por sus propiedades conservantes",
      "Puede contribuir al metabolismo de los carbohidratos",
      "Ingrediente tradicionalmente asociado con la digestión",
    ],
    badgeLabels: ["Más Vendido", "Sold Out X4"],
    faqs: [
      { q: "¿Cuáles son los ingredientes?",   a: "Vinagre de manzana orgánico, jugo de remolacha, vitamina B12, pectina (de manzana). Sin gluten, sin gelatina animal." },
      { q: "¿Política de envíos?",             a: "Envío gratis en pedidos superiores a $120.000. Entrega en 2-5 días hábiles a todo el país." },
      { q: "¿Garantía de satisfacción?",       a: "90 días de garantía total. Si no ves resultados, te devolvemos tu dinero sin preguntas." },
      { q: "¿Cómo tomarlo?",                   a: "2 gomitas al día antes de las comidas. Mastica bien antes de tragar para máxima absorción." },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIOS
// ─────────────────────────────────────────────────────────────────────────────

/** @type {Array} */
const TESTIMONIALS = [
  { name: "Laura M.",    handle: "@lauramfit",    quote: "Llevan 3 semanas en mi rutina y ya noto la diferencia en mi digestión. El sabor es increíble, nada que ver con el vinagre normal.", rating: 5, avatar: "LM", color: "av-purple" },
  { name: "Santiago R.", handle: "@santifit_co",  quote: "Las pedí sin muchas expectativas y me sorprendieron totalmente. Las recomiendo 100%. Ya pedí mi segundo envase.",                  rating: 5, avatar: "SR", color: "av-green"  },
  { name: "Valeria P.",  handle: "@vale.wellness", quote: "Por fin una forma de tomar el vinagre de manzana que no te revuelva el estómago. Mi familia entera las consume ahora.",             rating: 5, avatar: "VP", color: "av-coral"  },
  { name: "Andrés C.",   handle: "@andres.run",   quote: "El envío fue rapidísimo y la presentación es premium. Se nota que es un producto de calidad desde que abres la caja.",               rating: 4, avatar: "AC", color: "av-amber"  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sirve la aplicación como Web App pública de Google Apps Script.
 * @param {GoogleAppsScript.Events.DoGet} e
 * @returns {GoogleAppsScript.HTML.HtmlOutput}
 */
function doGet(e) {
  try {
    const template        = HtmlService.createTemplateFromFile("Index");
    template.config       = JSON.stringify(CONFIG);
    template.products     = JSON.stringify(PRODUCTS);
    template.testimonials = JSON.stringify(TESTIMONIALS);

    return template
      .evaluate()
      .setTitle(CONFIG.STORE_NAME + " · " + CONFIG.TAGLINE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag("viewport", "width=device-width, initial-scale=1.0, maximum-scale=1.0");
  } catch (err) {
    Logger.log("doGet error: " + err.message);
    return HtmlService.createHtmlOutput("<h1>Error</h1><p>" + err.message + "</p>");
  }
}

/**
 * Incluye archivos HTML parciales en la plantilla principal.
 * @param {string} filename
 * @returns {string}
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Registra un pedido/lead (opcional — conectar Google Sheets).
 * @param {Object} orderData
 * @returns {Object}
 */
function registerOrder(orderData) {
  try {
    // const sheet = SpreadsheetApp.openById("TU_SHEET_ID").getSheetByName("Pedidos");
    // sheet.appendRow([new Date(), orderData.name, orderData.phone,
    //                  orderData.productId, orderData.variant, orderData.total]);
    Logger.log("Pedido: " + JSON.stringify(orderData));
    return { success: true, message: "Pedido recibido." };
  } catch (err) {
    Logger.log("registerOrder error: " + err.message);
    return { success: false, message: err.message };
  }
}
