/**
 * @file Code.gs
 * @description Punto de entrada principal — R3GIMEN GYM PWA.
 *              Sirve la vista alumno o admin según el parámetro ?view=
 */

const MAIN_PAGE = 'Index';

const MOCK_USER = {
  nombre: 'Carlos', apellido: 'Martínez',
  estado: 'activo', diasRestantes: 5,
  diasUsados: 25, totalDias: 30,
  plan: 'Mensualidad Estándar'
};

const MOCK_CLASES = [
  { id: 'c1', hora: '6:00',  ampm: 'AM', nombre: 'Full Body Power',  instructor: 'Coach Andrés', cuposOcupados: 2, cuposTotal: 6 },
  { id: 'c2', hora: '8:00',  ampm: 'AM', nombre: 'Glúteos & Core',   instructor: 'Coach Laura',  cuposOcupados: 5, cuposTotal: 6 },
  { id: 'c3', hora: '4:00',  ampm: 'PM', nombre: 'Pecho & Tríceps',  instructor: 'Coach Andrés', cuposOcupados: 6, cuposTotal: 6 },
  { id: 'c4', hora: '6:00',  ampm: 'PM', nombre: 'Cardio HIIT',      instructor: 'Coach Laura',  cuposOcupados: 1, cuposTotal: 6 }
];

const MOCK_RUTINA = {
  nombre: 'Pecho & Tríceps', dia: 'Día 3',
  categoria: 'Hipertrofia', duracionMin: 45,
  ejercicios: [
    { numero: '01', nombre: 'Press Banca Plano',          series: '4 × 10', completado: false },
    { numero: '02', nombre: 'Press Inclinado Mancuernas', series: '3 × 12', completado: true  },
    { numero: '03', nombre: 'Aperturas en Polea',         series: '3 × 15', completado: false },
    { numero: '04', nombre: 'Fondos en Paralelas',        series: '3 × 12', completado: false },
    { numero: '05', nombre: 'Extensión Tríceps Polea',    series: '4 × 12', completado: false }
  ]
};

/** @const {Array} Pagos pendientes para el panel de admin */
const MOCK_PAGOS_PENDIENTES = [
  { nombre: 'Laura Gómez',    plan: 'Mensual',   vence: '2025-07-18', monto: '$80.000',  estado: 'vence-hoy'   },
  { nombre: 'Pedro Ruiz',     plan: 'Mensual',   vence: '2025-07-15', monto: '$80.000',  estado: 'vencido'     },
  { nombre: 'Ana Martínez',   plan: 'Trimestral',vence: '2025-07-22', monto: '$220.000', estado: 'por-vencer'  },
  { nombre: 'Jorge Castillo', plan: 'Mensual',   vence: '2025-07-14', monto: '$80.000',  estado: 'vencido'     },
  { nombre: 'Sofía Torres',   plan: 'Mensual',   vence: '2025-07-25', monto: '$80.000',  estado: 'por-vencer'  }
];

// ==========================================================
// PUNTO DE ENTRADA HTTP
// ==========================================================

/**
 * Sirve la PWA. Captura el parámetro `view` para ruteo server-side.
 * ?view=admin  → Panel de Catherine
 * (sin param)  → Vista alumno
 * @param {Object} e - Evento HTTP de GAS.
 * @returns {HtmlOutput}
 */
function doGet(e) {
  try {
    const view = (e && e.parameter && e.parameter.view) ? e.parameter.view : 'alumno';
    const tmpl = HtmlService.createTemplateFromFile(MAIN_PAGE);
    tmpl.currentView = view; // ← inyectado en la plantilla como variable global
    return tmpl.evaluate()
      .setTitle('R3GIMEN GYM — ' + (view === 'admin' ? 'Admin' : 'Mi Gym'))
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0');
  } catch (error) {
    Logger.log('Error en doGet: ' + error.message);
    return HtmlService.createHtmlOutput('<p>Error iniciando la aplicación.</p>');
  }
}

// ==========================================================
// FUNCIONES EXPUESTAS AL CLIENTE
// ==========================================================

/**
 * Retorna todos los datos del dashboard de alumno.
 * @returns {{usuario, clases, rutina}}
 */
function getDashboardData() {
  try {
    return { usuario: MOCK_USER, clases: MOCK_CLASES, rutina: MOCK_RUTINA };
  } catch (error) {
    Logger.log('Error en getDashboardData: ' + error.message);
    return { error: 'No se pudo cargar el dashboard.' };
  }
}

/**
 * Retorna los datos del panel de administración.
 * @returns {{pagosPendientes, clases}}
 */
function getAdminData() {
  try {
    return { pagosPendientes: MOCK_PAGOS_PENDIENTES, clases: MOCK_CLASES };
  } catch (error) {
    Logger.log('Error en getAdminData: ' + error.message);
    return { error: 'No se pudo cargar el panel admin.' };
  }
}

/**
 * Procesa la reserva de una clase.
 * @param {string} claseId
 * @returns {{success: boolean, mensaje: string}}
 */
function reservarClase(claseId) {
  try {
    const clase = MOCK_CLASES.find(c => c.id === claseId);
    if (!clase) return { success: false, mensaje: 'Clase no encontrada.' };
    if (clase.cuposOcupados >= clase.cuposTotal) return { success: false, mensaje: 'No hay cupos.' };
    return { success: true, mensaje: '¡Reserva confirmada para ' + clase.hora + ' ' + clase.ampm + '!' };
  } catch (error) {
    Logger.log('Error en reservarClase: ' + error.message);
    return { success: false, mensaje: 'Error al procesar la reserva.' };
  }
}

/**
 * Incluye archivos HTML parciales en la plantilla.
 * @param {string} filename
 * @returns {string}
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
