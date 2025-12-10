# Food Timeline 🍽️

Aplicación web simple para visualizar un timeline de comidas con imágenes almacenadas en Google Drive.

## Características

- 📸 Visualización de imágenes directamente desde Google Drive (sin descargas)
- 🔄 Actualización automática cada 30 segundos
- ⏱️ Timeline ordenado por fecha de creación
- 📱 Diseño responsive y moderno
- 🎨 Interfaz intuitiva con animaciones

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Google Drive API

Para acceder a las imágenes de Google Drive necesitas:

#### Opción A: API Key (más simple, solo lectura pública)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google Drive API**
4. Ve a "Credenciales" y crea una **API Key**
5. La carpeta de Google Drive debe ser **pública** (compartida con cualquiera que tenga el enlace)

#### Opción B: Service Account (más seguro, carpetas privadas)

Si prefieres usar carpetas privadas, necesitarás una Service Account:

1. En Google Cloud Console, crea una **Service Account**
2. Descarga el archivo JSON de credenciales
3. Comparte tu carpeta de Google Drive con el email de la Service Account
4. Usa las credenciales de la Service Account en lugar de API Key

### 3. Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` y completa:

```
GOOGLE_DRIVE_API_KEY=tu_api_key_aqui
GOOGLE_DRIVE_FOLDER_ID=id_de_la_carpeta_aqui
PORT=3000
```

**Para obtener el ID de la carpeta:**
- Abre la carpeta en Google Drive
- La URL será algo como: `https://drive.google.com/drive/folders/XXXXXXXXXXXXXXXXXX`
- El ID es la parte `XXXXXXXXXXXXXXXXXX`

### 4. Permisos de la carpeta

**IMPORTANTE:** La carpeta de Google Drive debe ser pública para que funcione con API Key:

1. Haz clic derecho en la carpeta
2. Selecciona "Compartir"
3. Cambia a "Cualquier persona con el enlace"
4. Asegúrate de que el permiso sea "Lector"

## Uso

### Iniciar el servidor

```bash
npm start
```

O para desarrollo:

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000`

## Estructura del proyecto

```
foodReport/
├── public/
│   ├── index.html       # Frontend HTML
│   ├── app.js          # Lógica del cliente
│   └── styles.css      # Estilos CSS
├── server.js           # Servidor Express
├── driveService.js     # Lógica de Google Drive API
├── .env               # Variables de entorno (crear manualmente)
├── .env.example       # Plantilla de variables
├── package.json       # Dependencias del proyecto
└── README.md         # Este archivo
```

## Notas importantes

- Las imágenes se cargan directamente desde Google Drive, no se descargan al servidor
- El timeline se actualiza automáticamente cada 30 segundos
- Las imágenes se ordenan por fecha de creación (más recientes primero)
- Solo se muestran archivos de tipo imagen (jpg, png, gif, etc.)

## Troubleshooting

### Error 403 al cargar imágenes

- Verifica que la carpeta sea pública
- Comprueba que la API Key sea correcta
- Asegúrate de que la Google Drive API esté habilitada

### No se muestran imágenes

- Verifica que el ID de la carpeta sea correcto
- Comprueba que haya imágenes en la carpeta
- Revisa la consola del navegador para errores

### Las imágenes no se actualizan

- El auto-refresh funciona cada 30 segundos
- Puedes ajustar el intervalo en `public/app.js` (variable `REFRESH_INTERVAL`)
