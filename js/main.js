document.addEventListener("DOMContentLoaded", () => {
  console.log("READY!");
});

anime({
  targets: "header",
  rotate: "1turn",
  backgroundColor: "#FFF",
  duration: 800,
});

// Obtener todos los elementos con la clase "tooltip"
const tooltips = document.querySelectorAll(".tooltip");

// Agregar eventos de mouseenter y mouseleave a cada tooltip
tooltips.forEach((tooltip) => {
  tooltip.addEventListener("mouseenter", () => {
    // Mostrar el tooltip
    tooltip.setAttribute("data-show", "true");
  });

  tooltip.addEventListener("mouseleave", () => {
    // Ocultar el tooltip
    tooltip.removeAttribute("data-show");
  });
});
