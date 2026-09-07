/* =========================================================================
   CONTACTO.JS — Envío real del formulario con EmailJS
   -------------------------------------------------------------------------
   1. Envía el mensaje a tu correo (plantilla de contacto).
   2. Envía automáticamente una confirmación a quien escribió (auto-reply).
   3. Muestra los estados: enviando, éxito y error.
   4. El formulario solo se limpia cuando el envío termina bien.

   Configuración: assets/js/emailjs-config.js
   ========================================================================= */

(function () {
  "use strict";

  var formulario = document.getElementById("form-contacto");
  if (!formulario) return;

  var estado = document.getElementById("estado-contacto");
  var boton = formulario.querySelector('button[type="submit"]');
  var textoBoton = boton ? boton.querySelector("span").textContent : "Enviar mensaje";

  function mostrarEstado(tipo, texto) {
    if (!estado) return;
    estado.className = "mensaje-estado visible " + tipo;
    estado.textContent = texto;
    estado.setAttribute("role", tipo === "error" ? "alert" : "status");
  }

  function limpiarEstado() {
    if (!estado) return;
    estado.className = "mensaje-estado";
    estado.textContent = "";
  }

  function bloquear(bloqueado) {
    if (!boton) return;
    boton.disabled = bloqueado;
    boton.querySelector("span").textContent = bloqueado ? "Enviando…" : textoBoton;
  }

  function configuracionValida(config) {
    if (!config) return false;
    var pendientes = ["TU_PUBLIC_KEY", "TU_SERVICE_ID", "TU_TEMPLATE_CONTACTO", "TU_TEMPLATE_RESPUESTA"];
    return [config.publicKey, config.serviceId, config.contactTemplate, config.autoReplyTemplate]
      .every(function (valor) { return valor && pendientes.indexOf(valor) === -1; });
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarEstado();

    // Trampa antispam: si viene lleno, es un bot. Se corta en silencio.
    var trampa = formulario.querySelector('input[name="sitio_web"]');
    if (trampa && trampa.value.trim() !== "") return;

    var config = window.EMAILJS_CONFIG;

    if (typeof window.emailjs === "undefined") {
      mostrarEstado("error", "No se pudo cargar el servicio de correo. Revisa tu conexión a internet y vuelve a intentarlo.");
      return;
    }

    if (!configuracionValida(config)) {
      mostrarEstado("error", "El formulario aún no está conectado a EmailJS. Completa los datos en assets/js/emailjs-config.js.");
      console.warn("[contacto] Faltan datos en window.EMAILJS_CONFIG");
      return;
    }

    var datos = {
      nombre: formulario.nombre.value.trim(),
      correo: formulario.correo.value.trim(),
      asunto: formulario.asunto.value.trim(),
      mensaje: formulario.mensaje.value.trim()
    };

    if (!datos.nombre || !datos.correo || !datos.asunto || !datos.mensaje) {
      mostrarEstado("error", "Faltan datos por llenar. Completa nombre, correo, asunto y mensaje.");
      return;
    }

    // Variables que reciben AMBAS plantillas de EmailJS
    var parametros = {
      nombre: datos.nombre,
      correo: datos.correo,
      asunto: datos.asunto,
      mensaje: datos.mensaje,
      fecha: new Date().toLocaleString("es-MX"),
      destinatario: (window.PORTAFOLIO && window.PORTAFOLIO.autor.correo) || ""
    };

    bloquear(true);
    mostrarEstado("cargando", "Enviando tu mensaje…");

    window.emailjs.init({ publicKey: config.publicKey });

    window.emailjs
      .send(config.serviceId, config.contactTemplate, parametros)
      .then(function () {
        // Confirmación automática para quien escribió
        return window.emailjs.send(config.serviceId, config.autoReplyTemplate, parametros);
      })
      .then(function () {
        mostrarEstado("exito", "Mensaje enviado. Te llegará una confirmación a " + datos.correo + ".");
        formulario.reset();
      })
      .catch(function (error) {
        console.error("[contacto] Error de EmailJS:", error);
        var detalle = (error && (error.text || error.message)) ? " (" + (error.text || error.message) + ")" : "";
        mostrarEstado("error", "El mensaje no se pudo enviar" + detalle + ". Escribe directamente a " +
          ((window.PORTAFOLIO && window.PORTAFOLIO.autor.correo) || "mi correo") + " o inténtalo de nuevo.");
      })
      .then(function () {
        bloquear(false);
      });
  });
})();
