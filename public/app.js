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
  
  // Agrupar imágenes por día
  const imagesByDay = groupImagesByDay(images);
  
  // Generar HTML agrupado por día
  timeline.innerHTML = Object.keys(imagesByDay).map(day => {
    const dayImages = imagesByDay[day];
    const date = new Date(dayImages[0].createdTime);
    const formattedDate = formatDate(date);
    
    const imagesHTML = dayImages.map(image => {
      const time = new Date(image.createdTime);
      const formattedTime = formatTime(time);
      
      return `
        <div class="day-image-item">
          <div class="day-image-wrapper">
            <img src="${image.imageUrl}" 
                 alt="${image.name}" 
                 loading="lazy">
          </div>
          <div class="day-image-time">${formattedTime}</div>
        </div>
      `;
    }).join('');
    
    return `
      <div class="day-group">
        <div class="day-header">
          <div class="day-marker"></div>
          <h2 class="day-date">${formattedDate}</h2>
          <span class="day-count">${dayImages.length} comida${dayImages.length > 1 ? 's' : ''}</span>
        </div>
        <div class="day-images-grid">
          ${imagesHTML}
        </div>
      </div>
    `;
  }).join('');
}

// Agrupar imágenes por día
function groupImagesByDay(images) {
  const groups = {};
  
  images.forEach(image => {
    const date = new Date(image.createdTime);
    const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    if (!groups[dayKey]) {
      groups[dayKey] = [];
    }
    groups[dayKey].push(image);
  });
  
  return groups;
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
