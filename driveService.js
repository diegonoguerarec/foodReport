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
      fields: 'files(id, name, mimeType, createdTime, modifiedTime, thumbnailLink, webContentLink, webViewLink, iconLink)',
      orderBy: 'createdTime desc',
      pageSize: 1000
    });

    const files = response.data.files;
    
    // Mapear los archivos a un formato más amigable
    const images = files.map(file => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
      // Usar proxy local para evitar problemas de CORS
      imageUrl: `/api/image/${file.id}`,
      viewUrl: `https://drive.google.com/file/d/${file.id}/view`,
      thumbnailUrl: file.thumbnailLink
    }));

    return images;
  } catch (error) {
    console.error('Error al obtener archivos de Google Drive:', error.message);
    throw error;
  }
}

/**
 * Obtiene el stream de una imagen desde Google Drive
 * @param {string} fileId - ID del archivo en Google Drive
 * @returns {Promise<Stream>} Stream de la imagen
 */
async function getImageStream(fileId) {
  try {
    const response = await drive.files.get(
      { fileId: fileId, alt: 'media' },
      { responseType: 'stream' }
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener stream de imagen:', error.message);
    throw error;
  }
}

module.exports = {
  getImages,
  getImageStream
};
