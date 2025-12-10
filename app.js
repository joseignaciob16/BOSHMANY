// ----------------------------------
// Datos del estado actual del PESV
// ----------------------------------
const hallazgos = [
  {
    tipo: "fortaleza",
    etiqueta: "Fortaleza",
    titulo: "Política de seguridad vial definida",
    detalle:
      "La empresa cuenta con un documento formal que marca lineamientos y responsabilidades básicas."
  },
  {
    tipo: "fortaleza",
    etiqueta: "Fortaleza",
    titulo: "Simulacro ejecutado en junio de 2025",
    detalle:
      "Se realizó al menos un ejercicio práctico de respuesta ante incidente vial con los conductores."
  },
  {
    tipo: "mejora",
    etiqueta: "Aspecto a mejorar",
    titulo: "Objetivos y metas del PESV sin formalizar",
    detalle:
      "Todavía no se han acordado metas cuantificables ni indicadores claros para el plan."
  },
  {
    tipo: "mejora",
    etiqueta: "Aspecto a mejorar",
    titulo: "Programas del PASO 8 en etapa pendiente",
    detalle:
      "Los programas específicos del paso 8 están identificados pero no se han puesto en marcha."
  },
  {
    tipo: "critico",
    etiqueta: "Punto crítico",
    titulo: "Ausencia de mediciones y auditorías internas",
    detalle:
      "No existe un sistema regular para medir resultados ni revisar el cumplimiento del PESV."
  },
  {
    tipo: "critico",
    etiqueta: "Punto crítico",
    titulo: "Sin campañas de sensibilización 2024-2025",
    detalle:
      "En los últimos años no se han desarrollado campañas formales para los conductores."
  }
];

// --------------------------
// Render de hallazgos
// --------------------------
function renderHallazgos() {
  const list = document.getElementById("hallazgos-list");
  if (!list) return;

  list.innerHTML = "";

  hallazgos.forEach((h) => {
    const li = document.createElement("li");
    li.classList.add("snapshot-item");

    if (h.tipo === "fortaleza") {
      li.classList.add("snapshot-item--fortaleza");
    } else if (h.tipo === "mejora") {
      li.classList.add("snapshot-item--mejora");
    } else {
      li.classList.add("snapshot-item--critico");
    }

    li.innerHTML = `
      <div class="snapshot-item__bullet"></div>
      <div class="snapshot-item__body">
        <span class="snapshot-item__label">${h.etiqueta}</span>
        <h4>${h.titulo}</h4>
        <p>${h.detalle}</p>
      </div>
    `;

    list.appendChild(li);
  });
}

// --------------------------
// Navegación entre secciones
// --------------------------
function setupTabs() {
  const buttons = document.querySelectorAll(".tab-button");
  const sections = document.querySelectorAll(".section");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-section");

      // activar pestaña
      buttons.forEach((b) => b.classList.remove("tab-button--active"));
      btn.classList.add("tab-button--active");

      // mostrar sección correspondiente
      sections.forEach((sec) => {
        sec.classList.toggle("section--active", sec.id === targetId);
      });
    });
  });
}

// --------------------------
// Lightbox para la galería
// --------------------------
function setupLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector(".lightbox__img");
  const lightboxCaption = lightbox.querySelector(".lightbox__caption");
  const closeBtn = lightbox.querySelector(".lightbox__close");
  const backdrop = lightbox.querySelector(".lightbox__backdrop");

  function openLightbox(img, captionText) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "";
    lightboxCaption.textContent = captionText || "";
    lightbox.classList.add("lightbox--visible");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    lightbox.classList.remove("lightbox--visible");
    lightbox.setAttribute("aria-hidden", "true");
  }

  // Click en cada imagen de la galería
  const galleryImages = document.querySelectorAll(".gallery-item img");
  galleryImages.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      const captionElem = img.parentElement.querySelector("figcaption");
      const captionText = captionElem ? captionElem.textContent.trim() : "";
      openLightbox(img, captionText);
    });
  });

  // Cerrar: botón, fondo oscuro, tecla ESC
  closeBtn.addEventListener("click", closeLightbox);
  backdrop.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && lightbox.classList.contains("lightbox--visible")) {
      closeLightbox();
    }
  });
}

// --------------------------
// Evaluación de conocimientos
// --------------------------
function setupQuiz() {
  const form = document.getElementById("quiz-form");
  if (!form) return;

  // Clave de respuestas para las preguntas cerradas
  // q1, q2, q3, q4, q5, q7, q9
  const correctAnswers = {
    q1: "20",          // 20 km/h
    q2: "pesv",        // Plan estratégico de seguridad vial
    q3: "avanzado24",  // Avanzado y 24 pasos
    q4: "todas",       // Todas las anteriores
    q5: "verdadero",   // Definición correcta de itinere
    q7: "todos",       // Todos los anteriores
    q9: "ninguna"      // Ningún paso deja de aplicar
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = form.nombre.value.trim();
    const summaryElem = document.getElementById("quiz-summary");

    let correctCount = 0;
    const totalScored = Object.keys(correctAnswers).length;

    // Limpiar estados previos
    form.querySelectorAll(".quiz-question").forEach((q) => {
      q.classList.remove("quiz-question--correct", "quiz-question--incorrect");
      const fb = q.querySelector(".quiz-feedback");
      if (fb && !fb.classList.contains("quiz-feedback--open")) {
        fb.textContent = "";
      }
    });

    // Revisar preguntas calificables
    Object.entries(correctAnswers).forEach(([name, correctValue]) => {
      const questionElem = form.querySelector(`.quiz-question[data-name="${name}"]`);
      if (!questionElem) return;

      const feedbackElem = questionElem.querySelector(".quiz-feedback");
      const selected = form.querySelector(`input[name="${name}"]:checked`);

      if (!selected) {
        questionElem.classList.add("quiz-question--incorrect");
        if (feedbackElem) {
          feedbackElem.textContent = "Sin respuesta seleccionada.";
        }
        return;
      }

      if (selected.value === correctValue) {
        correctCount++;
        questionElem.classList.add("quiz-question--correct");
        if (feedbackElem) {
          feedbackElem.textContent = "Respuesta correcta.";
        }
      } else {
        questionElem.classList.add("quiz-question--incorrect");

        let correctoTexto = "";
        switch (name) {
          case "q1":
            correctoTexto = "La respuesta correcta es 20 km/h.";
            break;
          case "q2":
            correctoTexto = 'La respuesta correcta es "Plan estratégico de seguridad vial".';
            break;
          case "q3":
            correctoTexto = "La respuesta correcta es: Avanzado y 24 pasos.";
            break;
          case "q4":
            correctoTexto = "La respuesta correcta es: Todas las anteriores.";
            break;
          case "q5":
            correctoTexto = "La respuesta correcta es: Verdadero.";
            break;
          case "q7":
            correctoTexto = "La respuesta correcta es: Todos los anteriores.";
            break;
          case "q9":
            correctoTexto = "La respuesta correcta es: Ninguna de las anteriores.";
            break;
        }

        if (feedbackElem) {
          feedbackElem.textContent = `Respuesta incorrecta. ${correctoTexto}`;
        }
      }
    });

    // Resumen final
    const nombreTexto = nombre ? ` ${nombre},` : "";
    if (summaryElem) {
      summaryElem.textContent = `Gracias${nombreTexto} obtuviste ${correctCount} de ${totalScored} respuestas correctas en las preguntas calificables. Las preguntas abiertas serán revisadas por el equipo de seguridad vial.`;
    }

    // Opcional: desplazar al resumen
    summaryElem?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}



// --------------------------
// Inicio
// --------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderHallazgos();
  setupTabs();
  setupLightbox();
  setupQuiz(); 
});


