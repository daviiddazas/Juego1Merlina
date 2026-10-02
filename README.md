# 🦇 Portal de Nunca Más: Test de Personalidad (Wednesday & Los Addams)

Aplicación web interactiva inspirada en el universo de **Wednesday (Merlina)** y **La Familia Addams** en la Academia Nevermore. Permite a los usuarios descubrir su alma de excluido entre 10 personajes icónicos, generar y descargar su credencial oficial de estudiante en alta resolución, explorar el vitral de la dualidad de Ophelia Hall y consultar expedientes de personajes.

---

## 🚀 Despliegue en Vercel (Recomendado)

El proyecto está 100% preparado y optimizado para desplegarse en **Vercel** o **GitHub**:

1. Sube tu código a un repositorio en **GitHub**.
2. Entra en [Vercel](https://vercel.com/) e inicia sesión con tu cuenta de GitHub.
3. Haz clic en **Add New... > Project** y selecciona tu repositorio.
4. Vercel detectará automáticamente la configuración gracias al archivo `vercel.json`:
   - **Framework Preset**: Vite
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
5. Haz clic en **Deploy** y en pocos segundos estará online.

---

## 💻 Ejecución en Local

> ⚠️ **Importante**: No abras el archivo `index.html` o `dist/index.html` haciendo doble clic directamente desde el explorador de archivos (`file:///`), ya que por seguridad los navegadores modernos bloquean los módulos JavaScript (CORS). Debe ejecutarse a través de un servidor HTTP local como se indica a continuación:

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar servidor de desarrollo
```bash
npm run dev
```
Abre en tu navegador la URL que muestra la terminal (por defecto `http://localhost:3000` o `http://localhost:5173`).

### 3. Compilar para producción y previsualizar
```bash
npm run build
npm run preview
```

---

## 🛠️ Tecnologías

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Web Audio API**: Síntesis procedural de chelo gótico, campanas y efectos sonoros sin depender de audios externos.
- **HTML5 Canvas**: Generador de credenciales estudiantiles oficiales descargables en PNG con sellos y datos personalizados.
