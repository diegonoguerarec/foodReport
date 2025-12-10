let lastUpdate = null;
const REFRESH_INTERVAL = 30000; // Actualizar cada 30 segundos

// Función para cargar y mostrar las imágenes
async function loadImages() {
  try {
    const response = await fetch('/api/images');
    
    if (!response.ok) {
      throw new Error('Error al cargar las imágenes');
    }

    const images = await response.json();
    
    // Ocultar loading
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error-message').style.display = 'none';
    
    // Mostrar las imágenes en el timeline
    displayImages(images);
    
    lastUpdate = new Date();
    console.log(`Timeline actualizado: ${images.length} imágenes cargadas`);
    
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('loading').style.display = 'none';
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = `Error al cargar las imágenes: ${error.message}`;
    errorDiv.style.display = 'block';
  }
}

// Función para mostrar las imágenes en el DOM
function displayImages(images) {
  const timeline = document.getElementById('timeline');
  
  if (images.length === 0) {
    timeline.innerHTML = '<p class="no-images">No hay imágenes disponibles en la carpeta.</p>';
    return;
  }
  
  timeline.innerHTML = images.map(image => {
    const date = new Date(image.createdTime);
    const formattedDate = formatDate(date);
    const formattedTime = formatTime(date);
    
    return `
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="image-wrapper">
            <img src="${image.imageUrl}" 
                 alt="${image.name}" 
                 loading="lazy"
                 onerror="this.onerror=null; this.src='${image.thumbnailUrl}';">
          </div>
          <div class="image-info">
            <div class="image-date">${formattedDate}</div>
            <div class="image-time">${formattedTime}</div>
            <div class="image-name">${image.name}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Formatear fecha
function formatDate(date) {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  };
  return date.toLocaleDateString('es-ES', options);
}

// Formatear hora
function formatTime(date) {
  return date.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
}

// Cargar imágenes al inicio
loadImages();

// Actualizar automáticamente cada cierto tiempo
setInterval(loadImages, REFRESH_INTERVAL);

// Indicador visual de última actualización
setInterval(() => {
  if (lastUpdate) {
    const seconds = Math.floor((new Date() - lastUpdate) / 1000);
    console.log(`Última actualización: hace ${seconds} segundos`);
  }
}, 5000);
