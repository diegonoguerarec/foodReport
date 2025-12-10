const { google } = require('googleapis');

const API_KEY = process.env.GOOGLE_DRIVE_API_KEY;
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

// Configurar Google Drive API
const drive = google.drive({
  version: 'v3',
  auth: API_KEY
});

/**
 * Obtiene las imágenes de la carpeta de Google Drive
 * @returns {Promise<Array>} Array de objetos con información de las imágenes
 */
async function getImages() {
  try {
    const response = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and mimeType contains 'image/' and trashed=false`,
      fields: 'files(id, name, mimeType, createdTime, modifiedTime, thumbnailLink, webContentLink)',
      orderBy: 'createdTime desc'
    });

    const files = response.data.files;
    
    // Mapear los archivos a un formato más amigable
    const images = files.map(file => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
      thumbnailUrl: file.thumbnailLink,
      // URL directa para ver la imagen (requiere permisos públicos)
      imageUrl: `https://drive.google.com/uc?export=view&id=${file.id}`,
      // URL alternativa
      viewUrl: `https://drive.google.com/file/d/${file.id}/view`
    }));

    return images;
  } catch (error) {
    console.error('Error al obtener archivos de Google Drive:', error.message);
    throw error;
  }
}

module.exports = {
  getImages
};
