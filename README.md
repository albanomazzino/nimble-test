# Nimble Test Challenge

Aplicación React para resolver el challenge de Nimble.

## ¿Qué hace?

- Obtiene los datos del candidato con `GET /api/candidate/get-by-email` usando `albimazzino@gmail.com`.
- Obtiene posiciones abiertas con `GET /api/jobs/get-list`.
- Muestra cada posición con:
  - título
  - input para URL del repositorio de GitHub
  - botón `Enviar`
- Envía la postulación con `POST /api/candidate/apply-to-job`.
- Maneja estados de carga, éxito y error.

## Variables de entorno

Crear un archivo `.env` a partir de este ejemplo:

```bash
VITE_REPO_URL=https://github.com/tu-usuario/tu-repo
```

## Ejecutar en local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
