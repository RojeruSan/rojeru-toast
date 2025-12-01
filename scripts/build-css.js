const fs = require('fs');
const path = require('path');

// Lee el contenido CSS del archivo src/styles.css
const cssContent = `
/* Tu CSS completo aquí - copia todo el CSS que ya tienes */
${fs.readFileSync(path.join(__dirname, '../src/styles.css'), 'utf8')}
`;

// Crea el directorio dist si no existe
if (!fs.existsSync(path.join(__dirname, '../dist'))) {
    fs.mkdirSync(path.join(__dirname, '../dist'), { recursive: true });
}

// Escribe el archivo CSS en dist
fs.writeFileSync(path.join(__dirname, '../dist/rojeru-toast.css'), cssContent);
console.log('✅ CSS construido en dist/rojeru-toast.css');