# Mis Tareas — proyecto Android (Expo)

Aplicación funcional de lista de tareas con almacenamiento local. No requiere cuenta, servidor ni permisos especiales.

## Identificador Android
`com.mobilepy.mistareasprueba`

Antes de publicar, verificá que este identificador no esté usado por otra aplicación de tu cuenta. Una vez publicada, no conviene cambiarlo.

## Generar el AAB para Google Play

1. Instalá Node.js y EAS CLI en una computadora.
2. Descomprimí este proyecto y abrí una terminal dentro de la carpeta `MisTareas`.
3. Ejecutá:

```bash
npm install
npx expo install --check
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile production
```

4. EAS te guiará para crear o seleccionar las credenciales de firma. Al terminar, descargá el archivo `.aab` desde el enlace que muestre EAS.
5. En Play Console, creá una aplicación nueva, elegí el idioma y nombre, y cargá el AAB en una pista de prueba interna.

Para instalar una versión APK de prueba en un teléfono:

```bash
eas build --platform android --profile preview
```

## Privacidad y ficha de Play

- La app guarda las tareas únicamente en el dispositivo.
- No integra publicidad, analítica, inicio de sesión ni envío de datos a servidores.
- `privacy-policy.html` es un texto base. Para publicarla, alojala en una URL pública HTTPS y colocá esa URL en Play Console.
- Completá Seguridad de los datos según el comportamiento real de la versión que subas. No declares que recopila datos si el binario no incorpora servicios que lo hagan.
- Prepará icono, capturas reales, descripción y clasificación de contenido antes de solicitar revisión.

## Importante
Este paquete contiene el código fuente del proyecto, no un AAB firmado. La compilación firmada se genera con EAS usando tu cuenta y credenciales. Google puede exigir requisitos de prueba y revisión según el tipo y antigüedad de la cuenta; subir una app de prueba no elimina esos requisitos.
