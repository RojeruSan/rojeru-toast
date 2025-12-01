# rojeru-toast

[![npm version](https://img.shields.io/npm/v/rojeru-toast.svg)](https://www.npmjs.com/package/rojeru-toast)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/min/rojeru-toast)](https://bundlephobia.com/package/rojeru-toast)

Una librería moderna de mensajes toast para aplicaciones web, compatible con todos los frameworks y HTML puro.

## Características

- 🎨 **Diseño moderno** con 3 temas (light, dark, colored)
- 📱 **Totalmente responsive**
- 🎭 **6 tipos de mensajes**: info, success, warning, error, loading
- ⚡ **Animaciones suaves** (slide, fade, scale)
- 🔧 **Altamente personalizable**
- 🌐 **Compatible con todos los frameworks**: React, Vue, Angular, Svelte, etc.
- 📦 **Sin dependencias**
- 🏗️ **API intuitiva y fluida**

## Instalación

### NPM
```bash
npm install rojeru-toast
```

### Yarn
```bash
yarn add rojeru-toast
```

### CDN
```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/rojeru-toast@latest/dist/rojeru-toast.min.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/rojeru-toast@latest/dist/rojeru-toast.min.js"></script>
```

## Uso Rápido

### HTML Puro
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/rojeru-toast@latest/dist/rojeru-toast.min.css">
</head>
<body>
    <script src="https://cdn.jsdelivr.net/npm/rojeru-toast@latest/dist/rojeru-toast.min.js"></script>
    <script>
        // Usar globalmente
        rojeruToast.success('¡Operación exitosa!');
        
        // O crear instancia
        const toast = new RojeruToast();
        toast.info('Mensaje informativo');
    </script>
</body>
</html>
```

### Módulos ES6
```javascript
import RojeruToast from 'rojeru-toast';

// Crear instancia
const toast = new RojeruToast();

// Métodos principales
toast.info('Mensaje informativo');
toast.success('¡Éxito!');
toast.warning('Advertencia');
toast.error('Error encontrado');

// Toast con título
toast.withTitle('Título', 'Mensaje de contenido');

// Toast de carga
const loadingToast = toast.loading('Procesando...');
// Luego completarlo
setTimeout(() => {
    loadingToast.complete('¡Completado!');
}, 2000);
```

### React
```jsx
import React from 'react';
import RojeruToast from 'rojeru-toast';

function App() {
    const toast = React.useMemo(() => new RojeruToast(), []);

    const showToast = () => {
        toast.success('¡Mensaje desde React!');
    };

    return (
        <button onClick={showToast}>
            Mostrar Toast
        </button>
    );
}
```

### Vue
```vue
<template>
    <button @click="showToast">Mostrar Toast</button>
</template>

<script>
import RojeruToast from 'rojeru-toast';

export default {
    data() {
        return {
            toast: null
        };
    },
    mounted() {
        this.toast = new RojeruToast();
    },
    methods: {
        showToast() {
            this.toast.success('¡Mensaje desde Vue!');
        }
    }
};
</script>
```

## API

### Métodos Principales

#### `show(title, message, options)`
Muestra un toast con título y mensaje.

```javascript
// Sin título
toast.show('Mensaje simple');

// Con título
toast.show('Título', 'Mensaje del contenido');

// Con opciones
toast.show('Título', 'Mensaje', {
    type: 'success',
    duration: 5000,
    position: 'top-center',
    theme: 'dark'
});
```

#### Métodos de conveniencia
```javascript
toast.info(message, options);
toast.success(message, options);
toast.warning(message, options);
toast.error(message, options);
toast.loading(message, options);
toast.withTitle(title, message, options);
```

### Opciones

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `type` | `string` | `'info'` | Tipo de toast: `'info'`, `'success'`, `'warning'`, `'error'`, `'loading'` |
| `duration` | `number` | `3000` | Duración en milisegundos (0 = permanente) |
| `position` | `string` | `'top-right'` | Posición: `'top-right'`, `'top-left'`, `'top-center'`, `'bottom-right'`, `'bottom-left'`, `'bottom-center'` |
| `theme` | `string` | `'light'` | Tema: `'light'`, `'dark'`, `'colored'` |
| `dismissible` | `boolean` | `true` | Si muestra botón de cerrar |
| `pauseOnHover` | `boolean` | `true` | Pausa la desaparición al hacer hover |
| `animation` | `string` | `'slide'` | Animación: `'slide'`, `'fade'`, `'scale'` |
| `closeOnClick` | `boolean` | `false` | Cierra al hacer click en el toast |

### Métodos de Instancia

Cada toast retornado tiene estos métodos:

```javascript
const toastInstance = toast.info('Mensaje');

// Obtener ID
const id = toastInstance.getId();

// Actualizar contenido
toastInstance.update('Nuevo mensaje');
toastInstance.update('Nuevo título', 'Nuevo mensaje');

// Cambiar tipo
toastInstance.changeType('success', '¡Completado!');

// Completar toast de carga
toastInstance.complete('¡Proceso completado!');

// Ocultar manualmente
toastInstance.hide();
```

### Métodos Globales

```javascript
// Ocultar toast por ID
toast.hideById('toast-id');

// Ocultar el último toast
toast.hideLast();

// Ocultar todos los toasts de un tipo
toast.hideByType('success');

// Limpiar todos los toasts
toast.clear();
```

## Personalización

### Configuración Global
```javascript
const toast = new RojeruToast();

// Cambiar opciones por defecto
toast.defaultOptions = {
    duration: 5000,
    position: 'top-center',
    theme: 'colored',
    animation: 'fade'
};
```

### CSS Custom Properties
```css
:root {
    --rojeru-toast-font-family: 'Arial, sans-serif';
    --rojeru-toast-border-radius: 8px;
    --rojeru-toast-spacing: 10px;
}
```

## Ejemplos Avanzados

### Toast Persistente
```javascript
const persistentToast = toast.info('Actualizando datos...', {
    duration: 0,
    dismissible: false
});

// Actualizar cuando termine la operación
setTimeout(() => {
    persistentToast.changeType('success', '¡Datos actualizados!', {
        duration: 3000,
        dismissible: true
    });
}, 2000);
```

### Toast con Acciones
```javascript
const actionToast = toast.info('¿Deseas guardar los cambios?', {
    duration: 0,
    closeOnClick: false
});

// Agregar botones personalizados
setTimeout(() => {
    const btnContainer = document.createElement('div');
    btnContainer.style.marginTop = '10px';
    btnContainer.innerHTML = `
        <button onclick="guardar()">Guardar</button>
        <button onclick="cancelar()">Cancelar</button>
    `;
    
    actionToast.element.querySelector('.rojeru-toast-content')
        .appendChild(btnContainer);
}, 100);
```

## Soporte para Frameworks

### React Hook
```jsx
// useToast.js
import { useRef } from 'react';
import RojeruToast from 'rojeru-toast';

export function useToast() {
    const toastRef = useRef(null);
    
    if (!toastRef.current) {
        toastRef.current = new RojeruToast();
    }
    
    return toastRef.current;
}

// Uso
function Component() {
    const toast = useToast();
    
    const handleClick = () => {
        toast.success('¡Hecho!');
    };
    
    return <button onClick={handleClick}>Click</button>;
}
```

## Licencia

MIT © Rogelio Urieta Camacho (RojeruSan)