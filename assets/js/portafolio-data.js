

window.PORTAFOLIO = {

  /* ---------------------------------------------------------------------
     DATOS GENERALES  (EDITAR si cambia algún dato)
     --------------------------------------------------------------------- */
  autor: {
    nombre: "Monica Isabel Lopez Alcocer",
    alias: "Mon_17",
    carrera: "Ingeniería en Tecnologías de la Información",
    asignatura: "CNO IV – Seguridad Informática",
    institucion: "Universidad Politécnica de San Luis Potosí",
    periodo: "Noveno Semestre",
    ubicacion: "San Luis Potosí, S.L.P.",
    correo: "Monicaetar@gmail.com",
    telefono: "+52 (440) 245 9187",
    foto: "assets/img/profile/yo.png",
    // EDITAR: si tienes repositorio público, escribe aquí la URL; si no, déjalo vacío ("").
    repositorio: ""
  },

  /* ---------------------------------------------------------------------
     TOMOS / PARCIALES
     --------------------------------------------------------------------- */
  parciales: [
    {
      numero: 1,
      pagina: "parcial1.html",
      carpeta: "parcial1/",
      titulo: "Fundamentos de Ciberseguridad",
      resumen: "Conceptos base para proteger la información: confidencialidad, integridad, disponibilidad, riesgos, vulnerabilidades y ataques más comunes.",
      actividades: [
        {
          numero: 1,
          titulo: "Análisis de ciberataque",
          archivo: "actividad_1.html",
          descripcion: "En esta actividad se analiza el ciberataque sufrido por el Banco de Chile en 2018, en el que se utilizó malware como distracción mientras se realizaban transferencias fraudulentas mediante el sistema SWIFT por aproximadamente 10 millones de dólares.",
          publicada: true
        },
        {
          numero: 2,
          titulo: "Aqui empíeza mi portafolio",
          archivo: "actividad_2.html",
          descripcion: "Esta actividad consiste en crear y publicar la estructura inicial de un portafolio digital para la materia de Seguridad Informática. El sitio debe ser funcional, accesible y consistente.",
          publicada: true
        },
        {
          numero: 3,
          titulo: "No presiones Esc... todavia",
          archivo: "actividad_3.html",
          descripcion: "Esta actividad consiste en desarrollar y documentar un programa que registre eventos del teclado, almacenándolos en un archivo local con fecha y hora.",
          publicada: true
        }
      ]
    },
    {
      numero: 2,
      pagina: "parcial2.html",
      carpeta: "parcial2/",
      titulo: "Sistemas de Gestión de la Seguridad",
      resumen: "Políticas, controles y procedimientos que permiten administrar los riesgos y mantener protegida la información dentro de una organización.",
      actividades: [
        /* EDITAR: aquí irán las actividades del Parcial 2 */
      ]
    },
    {
      numero: 3,
      pagina: "parcial3.html",
      carpeta: "parcial3/",
      titulo: "Temas Actuales en Seguridad Informática",
      resumen: "Nuevas formas de ataque, riesgos presentes en internet y estrategias actuales para proteger dispositivos, redes y datos.",
      actividades: [
        /* EDITAR: aquí irán las actividades del Parcial 3 */
      ]
    }
  ]
};
