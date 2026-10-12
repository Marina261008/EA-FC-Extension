# ⚽ EA Sports FC Career Hub (2026 / 2027)

> **La plataforma definitiva para gestionar, simular y documentar tu Modo Carrera de EA Sports FC.**  
> Diseñada para ofrecer una experiencia inmersiva de gestión técnica, redes sociales deportivas, mercado de fichajes y base de datos con más de 130 clubes y 2.000 jugadores reales.

---

## 🌟 Características Principales

### 🏟️ Base de Datos Oficial Completa (133 Clubes y +2.000 Jugadores)
- **Grandes Ligas al 100%**:
  - 🇪🇸 **LALIGA EA SPORTS** (20 clubes con plantillas completas).
  - 🥈 **LALIGA HYPERMOTION** (22 clubes de Segunda División).
  - 🏴󠁧󠁢󠁥󠁮󠁧󠁿 **Premier League** (20 clubes con titulares, suplentes y reservas).
  - 🇮🇹 **Serie A** (20 clubes con titulares, suplentes y reservas).
  - 🇩🇪 **Bundesliga** (18 clubes oficiales completos).
  - 🇫🇷 **Ligue 1** (18 clubes oficiales completos).
  - 🇺🇸 **MLS (EE. UU.)** y 🇸🇦 **Saudi Pro League** (con Inter Miami, Al Nassr, Al Hilal, etc.).
  - 🌟 **Promesas & Filiales** (Real Madrid Castilla, Barça Atlètic, Atlético de Madrid B).
- **Atributos FIFA Auténticos**: Medias reales (OVR), ritmo, tiro, pase, regate, defensa y físico (PAC, SHO, PAS, DRI, DEF, PHY).
- **Fotos y Escudos Oficiales**: Escudos vectoriales de alta definición y recortes fotográficos de rostros reales (*face cutouts*).
- **Herramientas de Base de Datos**: Filtros avanzados por posición, club y liga, fichajes instantáneos, y capacidad de **descargar o subir tu propio archivo `database.json`**.

---

### 📰 Feed de Prensa y Comunicados Oficiales
- **Generación Automática de Partidos**:
  - Publicación del **11 Inicial** antes del pitido inicial.
  - Comunicados instantáneos para cada gol y goleador.
  - Pantalla de **Resultado Final** con marcador en grande y foto del equipo.
- **Comunicados de Fichajes Dinámicos**:
  - Presentación oficial con el escudo de tu equipo.
  - Publicación de despedida y agradecimiento del club de procedencia.
  - Selector de equipo de procedencia editable según transcurran las temporadas.
- **Celebración de Títulos**: Fotos conmemorativas y trofeos generados en el tablero al consagrarse campeón de Liga, Copa o UEFA Champions League.

---

### 📋 Gestión de Plantilla y Táctica
- **Alineación Visual**: Pizarra táctica interactiva con distribución de titulares, capitanía, suplentes y reservas.
- **Rendimiento y Moral**: Control de moral, minutos disputados, goles, asistencias y dorsales.
- **Mercado de Fichajes**: Presupuesto de traspasos y masa salarial en tiempo real, cláusulas y altas/bajas.

---

### 🏆 Competiciones y Estadísticas
- **Selección Inteligente de Rivales**: Filtro dinámico según la competición que juegas (Liga nacional, Copas domésticas o Torneos Europeos).
- **Clasificaciones en Tiempo Real**: Puntos, partidos jugados, victorias, empates, derrotas y gol average.
- **Líderes de Temporada**: Tabla de máximos goleadores, asistentes y porteros con más porterías a cero (*Zamora*).
- **Academia de Cantera**: Ojeadores y desarrollo de jóvenes promesas.

---

## 💻 Tecnologías Utilizadas

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilos y UI**: [Tailwind CSS](https://tailwindcss.com/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Persistencia de Datos**: `localStorage` (sin necesidad de backend complejo; guarda tus partidas automáticamente en tu navegador).
- **Base de Datos**: Archivo JSON unificado (`src/data/database.json` y `public/database.json`).

---

## 🚀 Instalación y Ejecución Local

1. **Clonar o descargar el repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd ea-fc-career-hub
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

4. **Compilar para producción**:
   ```bash
   npm run build
   ```
   Los archivos listos para producción se generarán en la carpeta `dist/`.

---

## 🌐 Despliegue en Servidores Gratuitos

El proyecto está preparado como una **Single Page Application (SPA)** lista para servidores estáticos gratuitos:

### Despliegue en Netlify
1. Ejecuta `npm run build`.
2. Ve a [Netlify Drop](https://app.netlify.com/drop).
3. Arrastra la carpeta `dist` directamente a la página.
4. *¡Listo!* Incluye automáticamente el archivo `_redirects` para que las rutas funcionen sin errores al recargar.

### Despliegue en Vercel
1. Instala el CLI de Vercel con `npm i -g vercel`.
2. Ejecuta `vercel --prod` en la raíz del proyecto.

---

## 📁 Estructura del Proyecto

```text
ea-fc-career-hub/
├── public/
│   ├── _redirects         # Reglas de enrutamiento para Netlify/SPA
│   └── database.json      # Base de datos accesible públicamente
├── src/
│   ├── components/
│   │   ├── Dashboard/     # Resumen general del club y próximos partidos
│   │   ├── Database/      # Explorador y buscador de jugadores y clubes
│   │   ├── Feed/          # Red social, comunicados oficiales y prensa
│   │   ├── Matches/       # Registro de partidos y estadísticas
│   │   ├── Modals/        # Asistente de creación de carrera y fichajes
│   │   ├── Squad/         # Alineación táctica y plantilla
│   │   ├── Standings/     # Tabla de clasificación
│   │   ├── Stats/         # Máximos goleadores y asistentes
│   │   └── Youth/         # Academia de cantera
│   ├── data/
│   │   └── database.json  # Base de datos principal de clubes y jugadores
│   ├── clubsData.js       # Adaptador centralizado y lógica de ligas/rivales
│   ├── App.jsx            # Punto de entrada de la aplicación
│   └── index.css          # Estilos globales con Tailwind
├── scripts/               # Scripts de enriquecimiento y expansión de ligas
├── package.json
└── vite.config.js
```

---

## 📜 Licencia

Este proyecto ha sido desarrollado con fines recreativos y para la comunidad de **EA Sports FC**. Todos los derechos de nombres de clubes, escudos y jugadores pertenecen a sus respectivos propietarios y ligas oficiales.
