const express = require('express');
const path = require('path');
const imageService = require('./imageService');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos
app.use(express.static('public'));

// Servir carpeta de imágenes
app.use('/images', express.static('images'));

// Endpoint para obtener las imágenes del timeline
app.get('/api/images', async (req, res) => {
  try {
    const images = await imageService.getImages();
    res.json(images);
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    res.status(500).json({ error: 'Error al obtener imágenes' });
  }
});

// Servir el index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
