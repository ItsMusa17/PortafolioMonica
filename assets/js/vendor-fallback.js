/* =========================================================================
   VENDOR-FALLBACK.JS — Red de seguridad para las librerías
   -------------------------------------------------------------------------
   El sitio usa tres librerías desde assets/vendor/:
     · Bootstrap Icons  (iconos)
     · AOS              (animaciones al desplazar)
     · GLightbox        (ampliar las capturas de evidencia)

   Si alguna de esas carpetas no está (por ejemplo, al abrir el proyecto en
   una computadora nueva antes de copiar assets/vendor/), este archivo la
   carga desde un CDN para que la página se vea completa igual.

   Cuando tengas las carpetas locales, este archivo no hace nada:
   siempre gana la copia local. Puedes borrarlo si prefieres depender
   únicamente de assets/vendor/ (recuerda quitar también su <script>).
   ========================================================================= */

(function () {
  "use strict";

  var CDN = {
    iconosCss:    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css",
    aosCss:       "https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css",
    aosJs:        "https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js",
    glightboxCss: "https://cdn.jsdelivr.net/npm/glightbox@3.3.0/dist/css/glightbox.min.css",
    glightboxJs:  "https://cdn.jsdelivr.net/npm/glightbox@3.3.0/dist/js/glightbox.min.js"
  };

  function cargarCss(url) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
  }

  function cargarJs(url, alTerminar) {
    var script = document.createElement("script");
    script.src = url;
    script.onload = alTerminar || null;
    document.head.appendChild(script);
  }

  function reactivar() {
    if (typeof window.PORTAFOLIO_ACTIVAR_LIBRERIAS === "function") {
      window.PORTAFOLIO_ACTIVAR_LIBRERIAS();
    }
  }

  /** ¿Se cargó la hoja de estilos de Bootstrap Icons? */
  function hayIconos() {
    var prueba = document.createElement("i");
    prueba.className = "bi bi-shield-lock";
    prueba.style.cssText = "position:absolute;left:-9999px;opacity:0";
    document.body.appendChild(prueba);
    var contenido = "";
    try {
      contenido = window.getComputedStyle(prueba, ":before").getPropertyValue("content");
    } catch (e) { /* navegador sin soporte: se asume que sí */ contenido = "ok"; }
    document.body.removeChild(prueba);
    return contenido && contenido !== "none" && contenido !== "normal" && contenido !== '""';
  }

  function revisar() {
    if (!hayIconos()) {
      cargarCss(CDN.iconosCss);
      console.info("[portafolio] Bootstrap Icons no está en assets/vendor/. Se cargó desde CDN.");
    }

    if (typeof window.AOS === "undefined") {
      cargarCss(CDN.aosCss);
      cargarJs(CDN.aosJs, reactivar);
      console.info("[portafolio] AOS no está en assets/vendor/. Se cargó desde CDN.");
    }

    if (typeof window.GLightbox === "undefined") {
      cargarCss(CDN.glightboxCss);
      cargarJs(CDN.glightboxJs, reactivar);
      console.info("[portafolio] GLightbox no está en assets/vendor/. Se cargó desde CDN.");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", revisar);
  } else {
    revisar();
  }
})();
