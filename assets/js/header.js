fetch("components/header.html")
  .then(response => {
    if (!response.ok) {
      throw new Error("No se pudo cargar el header");
    }

    return response.text();
  })
  .then(data => {

    // Insertar el header
    document.getElementById("header-container").innerHTML = data;

    // Cargar main.js después del header
    const mainScript = document.createElement("script");
    mainScript.src = "assets/js/main.js";

    mainScript.onload = function () {

      // Inicializar manualmente las animaciones AOS
      if (typeof AOS !== "undefined") {
        AOS.init({
          duration: 600,
          easing: "ease-in-out",
          once: true,
          mirror: false
        });

        AOS.refresh();
      }

      // Quitar preloader
      const preloader = document.getElementById("preloader");

      if (preloader) {
        preloader.remove();
      }
    };

    document.body.appendChild(mainScript);

  })
  .catch(error => {

    console.error("Error cargando el header:", error);

    const preloader = document.getElementById("preloader");

    if (preloader) {
      preloader.remove();
    }

  });