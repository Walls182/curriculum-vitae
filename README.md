# 🐱 Mi Hoja de Vida Interactiva

> Portfolio personal con **gato animado en Canvas**, diseño oscuro moderno y animaciones fluidas.

## ✨ Características

| Feature | Descripción |
|---------|-------------|
| 🐾 **Gato animado** | Canvas API con 7 estados: `idle`, `walk`, `run`, `sit`, `sleep`, `jump`, `wave` |
| 🏃 **Gato caminante** | El gato camina por la pantalla, reacciona al scroll y al hover |
| ⌨️ **Typing effect** | Texto que escribe y borra frases automáticamente |
| 🎞️ **Scroll animations** | Elementos que aparecen con IntersectionObserver |
| 📊 **Skill bars** | Barras de progreso animadas al hacer scroll |
| 🔢 **Contadores** | Números que cuentan con animación suave |
| 🖱️ **Cursor personalizado** | Cursor custom que reacciona a elementos interactivos |
| 🎮 **Easter egg** | Konami Code (↑↑↓↓←→←→BA) activa animación especial |
| 📱 **Responsive** | Adaptado a móviles, tablets y desktop |
| 💌 **Formulario** | Abre cliente de correo con datos pre-llenados |

## 📁 Estructura

```
mi-hoja-de-vida/
├── index.html    # Estructura principal
├── style.css     # Estilos y animaciones CSS
├── cat.js        # Motor del gato animado (Canvas API)
├── script.js     # Interactividad general
└── README.md
```

## 🚀 Cómo personalizar

### 1. Cambia tu información personal
En `index.html` busca y reemplaza:
- `Tu Nombre` → tu nombre real
- `tu@email.com` → tu email
- `tu-usuario` → tu usuario de GitHub/LinkedIn
- Experiencia, educación y proyectos → tus datos reales

### 2. Cambia los colores
En `style.css` edita las variables CSS al inicio:
```css
:root {
  --accent:  #7c3aed;   /* Color principal (violeta) */
  --accent2: #a855f7;   /* Acento secundario */
  --accent3: #06b6d4;   /* Acento terciario (cyan) */
}
```

### 3. Agrega más proyectos
Copia el bloque `.project-card` en `index.html` y modifica el contenido.

## 🌐 Subir a GitHub Pages

### Paso a paso

```bash
# 1. Inicializar repositorio (ya hecho si seguiste las instrucciones)
cd C:\mi-hoja-de-vida
git init
git add .
git commit -m "🐱 Initial commit – Mi hoja de vida interactiva"

# 2. Crea el repositorio en GitHub:
#    → Ve a https://github.com/new
#    → Nombre: mi-hoja-de-vida  (o tu-usuario.github.io para URL limpia)
#    → Público, sin README

# 3. Conecta y sube
git remote add origin https://github.com/TU-USUARIO/mi-hoja-de-vida.git
git branch -M main
git push -u origin main

# 4. Activa GitHub Pages:
#    → Ve a tu repo en GitHub
#    → Settings → Pages
#    → Source: Deploy from a branch
#    → Branch: main / (root)
#    → Save

# 5. Tu sitio estará en:
#    https://TU-USUARIO.github.io/mi-hoja-de-vida/
```

### ⚡ Tip: URL personalizada
Para tener `https://TU-USUARIO.github.io/` (sin sub-ruta):
- Crea el repositorio con nombre exacto: `TU-USUARIO.github.io`

### 🔄 Actualizar tu sitio
```bash
git add .
git commit -m "✨ Actualización del portafolio"
git push
```
GitHub Pages se actualiza automáticamente en ~1 minuto.

## 🎮 Easter Egg

Escribe el **Konami Code** en tu teclado en la página:
```
↑ ↑ ↓ ↓ ← → ← → B A
```
¡El gato se pondrá muy emocionado! 🎉

## 📬 Formulario de contacto con Formspree

Para recibir mensajes sin backend:

1. Ve a [formspree.io](https://formspree.io) y crea una cuenta gratuita
2. Crea un formulario y copia tu `form-id`
3. En `index.html` cambia el `<form>` por:
```html
<form action="https://formspree.io/f/TU-FORM-ID" method="POST">
```
4. En `script.js` elimina el listener del formulario (o déjalo para el efecto visual)

---
*Hecho con ❤️ HTML, CSS y JavaScript puro – Sin frameworks, sin dependencias* 🐾
