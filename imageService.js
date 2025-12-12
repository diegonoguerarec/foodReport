const fs = require('fs').promises;
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');

/**
 * Obtiene todas las imágenes de la carpeta local
 * @returns {Promise<Array>} Array de objetos con información de las imágenes
 */
async function getImages() {
  try {
    const files = await fs.readdir(IMAGES_DIR);
    
    // Filtrar solo archivos de imagen
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });
    
    // Obtener información de cada archivo
    const images = await Promise.all(
      imageFiles.map(async (file) => {
        const filePath = path.join(IMAGES_DIR, file);
        const stats = await fs.stat(filePath);
        
        return {
          id: file,
          name: file,
          createdTime: stats.birthtime.toISOString(),
          modifiedTime: stats.mtime.toISOString(),
          imageUrl: `/images/${encodeURIComponent(file)}`,
          size: stats.size
        };
      })
    );
    
    // Ordenar por fecha de creación (más recientes primero)
    images.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
    
    return images;
  } catch (error) {
    console.error('Error al obtener imágenes:', error.message);
    throw error;
  }
}

module.exports = {
  getImages
};
