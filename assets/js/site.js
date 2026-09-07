/* =========================================================================
   SITE.JS — Componentes compartidos del portafolio
   -------------------------------------------------------------------------
   Se encarga de:
     · calcular la ruta base correcta (funciona local y en GitHub Pages);
     · construir el menú lateral (índice del grimorio) y el pie de página;
     · marcar la página activa y abrir el submenú del parcial correspondiente;
     · dibujar las tarjetas de actividades en las páginas de parcial;
     · generar la navegación "actividad anterior / siguiente";
     · menú responsivo, botón "volver arriba", AOS y GLightbox.

   NO necesitas editar este archivo para agregar actividades.
   Las actividades se configuran en:  assets/js/portafolio-data.js
   ========================================================================= */

(function () {
  "use strict";

  var datos = window.PORTAFOLIO;
  if (!datos) {
    console.error("[portafolio] Falta assets/js/portafolio-data.js");
    return;
  }

  /* =======================================================================
     1. RUTAS
     -----------------------------------------------------------------------
     Cada página declara su profundidad en la etiqueta <html>:
        raíz            ->  <html lang="es" data-base="./">
        dentro de /parcial1/ ->  <html lang="es" data-base="../">
     Todos los enlaces del menú y del pie se construyen a partir de ese valor,
     por lo que nunca se usan rutas absolutas tipo "/algo" que romperían
     el sitio dentro del subdirectorio del repositorio en GitHub Pages.
     ======================================================================= */
  var BASE = document.documentElement.getAttribute("data-base") || "./";

  function ruta(destino) {
    if (!destino) return BASE;
    if (/^(https?:|mailto:|tel:|#)/.test(destino)) return destino;
    return BASE + destino;
  }

  /** Convierte cualquier URL en una ruta comparable ("/repo/parcial1/x.html"). */
  function normalizar(url) {
    try {
      var p = new URL(url, window.location.href).pathname;
      if (p.charAt(p.length - 1) === "/") p += "index.html";
      return decodeURIComponent(p);
    } catch (e) {
      return String(url);
    }
  }

  var PAGINA_ACTUAL = normalizar(window.location.href);

  function esPaginaActual(destino) {
    return normalizar(ruta(destino)) === PAGINA_ACTUAL;
  }

  function escapar(texto) {
    return String(texto == null ? "" : texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* =======================================================================
     2. MENÚ LATERAL (ÍNDICE DEL GRIMORIO)
     ======================================================================= */
  function enlaceContacto() {
    // Desde el Inicio basta el ancla; desde el resto hay que volver al Inicio.
    return esPaginaActual("index.html") ? "#contact" : ruta("index.html#contact");
  }

  function construirSidebar() {
    var contenedor = document.getElementById("sidebar-container");
    if (!contenedor) return;

    var a = datos.autor;
    var html = "";

    html +=
      '<aside class="grimorio-sidebar" id="grimorio-sidebar" aria-label="Índice del portafolio">' +
        '<div class="sidebar-cabecera">' +
          '<a href="' + ruta("index.html") + '" class="retrato" aria-label="Ir al inicio del portafolio">' +
            '<img src="' + ruta(a.foto) + '" alt="Retrato de ' + escapar(a.nombre) + '"' +
            ' onerror="this.parentNode.classList.add(\'sin-foto\'); this.remove();">' +
          "</a>" +
          '<p class="sidebar-nombre">' + escapar(a.nombre) + "</p>" +
          '<p class="sidebar-alias">' + escapar(a.alias) + "</p>" +
          '<p class="sidebar-materia">' + escapar(a.asignatura) + "</p>" +
        "</div>" +
        '<nav class="indice-nav" aria-label="Navegación principal">' +
          '<ul class="indice-lista">';

    // Inicio
    html +=
      "<li>" +
        '<a class="indice-enlace' + (esPaginaActual("index.html") ? " activo" : "") + '" href="' + ruta("index.html") + '"' +
        (esPaginaActual("index.html") ? ' aria-current="page"' : "") + ">" +
          '<i class="bi bi-journal-bookmark-fill" aria-hidden="true"></i><span>Inicio</span>' +
        "</a>" +
      "</li>";

    // Sobre mí
    html +=
      "<li>" +
        '<a class="indice-enlace' + (esPaginaActual("about.html") ? " activo" : "") + '" href="' + ruta("about.html") + '"' +
        (esPaginaActual("about.html") ? ' aria-current="page"' : "") + ">" +
          '<i class="bi bi-feather" aria-hidden="true"></i><span>Sobre mí</span>' +
        "</a>" +
      "</li>";

    // Parciales (con submenú de actividades)
    datos.parciales.forEach(function (parcial, i) {
      var idSub = "submenu-parcial-" + parcial.numero;
      var enParcial =
        esPaginaActual(parcial.pagina) ||
        PAGINA_ACTUAL.indexOf("/" + parcial.carpeta) !== -1;

      html += 
        '<li class="indice-grupo">' +
          '<button type="button" class="indice-enlace indice-boton" aria-expanded="' + (enParcial ? "true" : "false") + '" aria-controls="' + idSub + '">' +
            '<i class="bi bi-book' + (enParcial ? "-fill" : "") + '" aria-hidden="true"></i>' +
            "<span>Parcial " + parcial.numero + "</span>" +
            '<i class="bi bi-chevron-down chevron" aria-hidden="true"></i>' +
          "</button>" +
          '<ul class="indice-submenu' + (enParcial ? " abierto" : "") + '" id="' + idSub + '">' +
            "<li>" +
              '<a class="indice-subenlace' + (esPaginaActual(parcial.pagina) ? " activo" : "") + '" href="' + ruta(parcial.pagina) + '"' +
              (esPaginaActual(parcial.pagina) ? ' aria-current="page"' : "") + ">Presentación del parcial</a>" +
            "</li>";


      if (parcial.actividades.length === 0) {
        html += '<li><span class="indice-subenlace pendiente">Sin actividades aún</span></li>';
      } else {
        parcial.actividades.forEach(function (act) {
          var destino = parcial.carpeta + act.archivo;
          if (act.publicada) {
            html +=
              "<li>" +
                '<a class="indice-subenlace' + (esPaginaActual(destino) ? " activo" : "") + '" href="' + ruta(destino) + '"' +
                (esPaginaActual(destino) ? ' aria-current="page"' : "") + ">Actividad " + act.numero + "</a>" +
              "</li>";
          } else {
            html += '<li><span class="indice-subenlace pendiente">Actividad ' + act.numero + " (pendiente)</span></li>";
          }
        });
      }
      
      var destinoProyecto = "proyecto" + parcial.numero + ".html";
      html +=
        "<li>" +
          '<a class="indice-subenlace' + (esPaginaActual(destinoProyecto) ? " activo" : "") + '" href="' + ruta(destinoProyecto) + '"' +
          (esPaginaActual(destinoProyecto) ? ' aria-current="page"' : "") + ">Proyecto</a>" +
        "</li>";
      

      html += "</ul></li>";
      void i;
    });

        // Salon de la fama
    html +=
      "<li>" +
        '<a class="indice-enlace' + (esPaginaActual("linetime.html") ? " activo" : "") + '" href="' + ruta("linetime.html") + '"' +
        (esPaginaActual("linetime.html") ? ' aria-current="page"' : "") + ">" +
          '<i class="bi bi-award" aria-hidden="true"></i><span>Salon de la fama</span>' +
        "</a>" +
      "</li>";

    // Contacto
    html +=
      "<li>" +
        '<a class="indice-enlace" href="' + enlaceContacto() + '">' +
          '<i class="bi bi-envelope-paper" aria-hidden="true"></i><span>Contacto</span>' +
        "</a>" +
      "</li>";

    html +=
          "</ul>" +
        "</nav>" +
        '<div class="sidebar-pie">' +
          "<p>" + escapar(a.institucion) + "<br>" + escapar(a.periodo) + "</p>" +
        "</div>" +
      "</aside>" +
      '<div class="velo" id="velo-menu" hidden></div>';

    contenedor.innerHTML = html;
  }

  /* =======================================================================
     3. BARRA SUPERIOR MÓVIL Y MENÚ RESPONSIVO
     ======================================================================= */
  function construirTopbar() {
    var contenedor = document.getElementById("topbar-container");
    if (!contenedor) return;

    contenedor.innerHTML =
      '<div class="topbar">' +
        '<a href="' + ruta("index.html") + '" class="topbar-marca">' + escapar(datos.autor.alias) + " · Portafolio</a>" +
        '<button type="button" class="boton-menu" id="boton-menu" aria-expanded="false" aria-controls="grimorio-sidebar" aria-label="Abrir el índice del portafolio">' +
          '<i class="bi bi-list" aria-hidden="true"></i>' +
        "</button>" +
      "</div>";
  }

  function activarMenu() {
    var boton = document.getElementById("boton-menu");
    var sidebar = document.getElementById("grimorio-sidebar");
    var velo = document.getElementById("velo-menu");
    if (!boton || !sidebar || !velo) return;

    function abrir() {
      sidebar.classList.add("abierta");
      velo.hidden = false;
      requestAnimationFrame(function () { velo.classList.add("visible"); });
      boton.setAttribute("aria-expanded", "true");
      boton.setAttribute("aria-label", "Cerrar el índice del portafolio");
      document.body.style.overflow = "hidden";
    }

    function cerrar(devolverFoco) {
      sidebar.classList.remove("abierta");
      velo.classList.remove("visible");
      window.setTimeout(function () { velo.hidden = true; }, 320);
      boton.setAttribute("aria-expanded", "false");
      boton.setAttribute("aria-label", "Abrir el índice del portafolio");
      document.body.style.overflow = "";
      if (devolverFoco) boton.focus();
    }

    boton.addEventListener("click", function () {
      if (sidebar.classList.contains("abierta")) cerrar(false);
      else abrir();
    });

    velo.addEventListener("click", function () { cerrar(false); });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sidebar.classList.contains("abierta")) cerrar(true);
    });

    // Al elegir una opción en móvil, el menú se cierra
    sidebar.addEventListener("click", function (e) {
      var enlace = e.target.closest("a");
      if (enlace && window.innerWidth < 992) cerrar(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 992 && sidebar.classList.contains("abierta")) cerrar(false);
    });
  }

  /* =======================================================================
     4. SUBMENÚS DESPLEGABLES
     ======================================================================= */
  function activarSubmenus() {
    var botones = document.querySelectorAll(".indice-boton");
    Array.prototype.forEach.call(botones, function (boton) {
      boton.addEventListener("click", function () {
        var submenu = document.getElementById(boton.getAttribute("aria-controls"));
        var abierto = boton.getAttribute("aria-expanded") === "true";
        boton.setAttribute("aria-expanded", abierto ? "false" : "true");
        if (submenu) submenu.classList.toggle("abierto", !abierto);
        var icono = boton.querySelector(".bi-book, .bi-book-fill");
        if (icono) icono.className = (abierto ? "bi bi-book" : "bi bi-book-fill");
      });
    });
  }

  /* =======================================================================
     5. PIE DE PÁGINA
     ======================================================================= */
  function construirFooter() {
    var contenedor = document.getElementById("footer-container");
    if (!contenedor) return;

    var a = datos.autor;
    var anio = new Date().getFullYear();
    var repo = a.repositorio
      ? '<a href="' + escapar(a.repositorio) + '" target="_blank" rel="noopener"><i class="bi bi-github" aria-hidden="true"></i> Repositorio</a>'
      : "";

    contenedor.innerHTML =
      '<footer class="pie-grimorio">' +
        '<div class="contenedor">' +
          '<p class="nombre">' + escapar(a.nombre) + "</p>" +
          '<p class="materia">Portafolio académico · ' + escapar(a.asignatura) + "</p>" +
          '<div class="pie-enlaces">' +
            '<a href="mailto:' + escapar(a.correo) + '"><i class="bi bi-envelope" aria-hidden="true"></i> ' + escapar(a.correo) + "</a>" +
            repo +
          "</div>" +
          '<p class="derechos">' + escapar(a.institucion) + " · " + escapar(a.periodo) + " · " + anio + "</p>" +
        "</div>" +
      "</footer>";
  }

  /* =======================================================================
     6. TARJETAS DE ACTIVIDADES (páginas de parcial)
     Se activa con:  <div data-actividades="1"></div>
     ======================================================================= */
  function construirActividades() {
    var contenedor = document.querySelector("[data-actividades]");
    if (!contenedor) return;

    var numero = parseInt(contenedor.getAttribute("data-actividades"), 10);
    var parcial = datos.parciales.filter(function (p) { return p.numero === numero; })[0];
    if (!parcial) return;

    if (parcial.actividades.length === 0) {
      contenedor.innerHTML =
        '<p class="vacio">Este tomo aún no tiene capítulos escritos. Las actividades del Parcial ' +
        numero + " se publicarán conforme avance el curso.</p>";
      return;
    }

    var html = '<div class="rejilla rejilla-2">';
    parcial.actividades.forEach(function (act, i) {
      var destino = ruta(parcial.carpeta + act.archivo);
      var etiquetas = (act.etiquetas || []).map(function (t) {
        return '<li><span class="etiqueta">' + escapar(t) + "</span></li>";
      }).join("");

      html +=
        '<article class="tarjeta capitulo' + (act.publicada ? "" : " pendiente") + '" data-aos="fade-up" data-aos-delay="' + (i % 3) * 100 + '">' +
          '<span class="capitulo-numero" aria-hidden="true">' + act.numero + "</span>" +
          '<span class="eyebrow">Capítulo ' + act.numero + "</span>" +
          "<h3>" + escapar(act.titulo) + "</h3>" +
          "<p>" + escapar(act.descripcion) + "</p>" +
          (etiquetas ? '<ul class="etiquetas">' + etiquetas + "</ul>" : "") +
          '<div class="pie-tarjeta">' +
            (act.publicada
              ? '<a class="enlace-flecha" href="' + destino + '">Ver actividad <i class="bi bi-arrow-right" aria-hidden="true"></i></a>'
              : '<span class="tomo-estado">Actividad pendiente</span>') +
          "</div>" +
        "</article>";
    });
    html += "</div>";

    contenedor.innerHTML = html;
  }

  /* =======================================================================
     7. NAVEGACIÓN ENTRE ACTIVIDADES (anterior / siguiente)
     Se activa con:  <nav data-nav-actividad data-parcial="1" data-actividad="1">
     ======================================================================= */
  function construirNavegacionActividad() {
    var nav = document.querySelector("[data-nav-actividad]");
    if (!nav) return;

    var numParcial = parseInt(nav.getAttribute("data-parcial"), 10);
    var numActividad = parseInt(nav.getAttribute("data-actividad"), 10);
    var parcial = datos.parciales.filter(function (p) { return p.numero === numParcial; })[0];
    if (!parcial) return;

    var publicadas = parcial.actividades.filter(function (a) { return a.publicada; });
    var indice = -1;
    publicadas.forEach(function (a, i) { if (a.numero === numActividad) indice = i; });

    var anterior = indice > 0 ? publicadas[indice - 1] : null;
    var siguiente = indice > -1 && indice < publicadas.length - 1 ? publicadas[indice + 1] : null;

    function bloque(act, direccion, clase) {
      if (!act) {
        return '<span class="inactivo ' + clase + '">' +
          (direccion === "anterior" ? "Primera actividad del parcial" : "Última actividad del parcial") + "</span>";
      }
      return '<div class="' + clase + '"><a href="' + ruta(parcial.carpeta + act.archivo) + '">' +
        '<span class="direccion">' + (direccion === "anterior" ? "← Anterior" : "Siguiente →") + "</span>" +
        '<span class="titulo-enlace">' + escapar(act.titulo) + "</span></a></div>";
    }

    nav.classList.add("paginacion-actividades");
    nav.innerHTML =
      bloque(anterior, "anterior", "anterior") +
      '<a class="boton boton-fantasma" href="' + ruta(parcial.pagina) + '">Volver al Parcial ' + parcial.numero + "</a>" +
      bloque(siguiente, "siguiente", "siguiente");
  }

  /* =======================================================================
     8. BOTÓN VOLVER ARRIBA
     ======================================================================= */
  function activarSubir() {
    var boton = document.getElementById("subir");
    if (!boton) return;
    function alternar() {
      boton.classList.toggle("visible", window.scrollY > 400);
    }
    window.addEventListener("scroll", alternar, { passive: true });
    alternar();
    boton.addEventListener("click", function (e) {
      e.preventDefault();
      var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reducido ? "auto" : "smooth" });
    });
  }

  /* =======================================================================
     9. LIBRERÍAS OPCIONALES (AOS y GLightbox)
     ======================================================================= */
  var glightboxCreado = false;

  function activarLibrerias() {
    var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (window.AOS) {
      document.documentElement.classList.remove("sin-aos");
      window.AOS.init({
        duration: reducido ? 0 : 650,
        easing: "ease-out",
        once: true,
        offset: 60,
        disable: reducido
      });
    } else {
      // Si AOS no cargó, el contenido debe verse igual (nunca invisible)
      document.documentElement.classList.add("sin-aos");
    }

    if (window.GLightbox && !glightboxCreado) {
      glightboxCreado = true;
      window.GLightbox({ selector: ".glightbox", touchNavigation: true, loop: true });
    }
  }

  /* =======================================================================
     10. ARRANQUE
     ======================================================================= */
  // Permite reintentar la activación si AOS o GLightbox llegan desde el respaldo CDN
  window.PORTAFOLIO_ACTIVAR_LIBRERIAS = activarLibrerias;

  function iniciar() {
    construirTopbar();
    construirSidebar();
    construirFooter();
    construirActividades();
    construirNavegacionActividad();
    activarSubmenus();
    activarMenu();
    activarSubir();
    activarLibrerias();
    if (window.AOS) window.AOS.refreshHard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
