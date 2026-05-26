# GymPro — Panel Administrativo Full-Stack

Panel administrativo para gimnasios con frontend en HTML/CSS/JS vanilla + ApexCharts y backend en **FastAPI + SQLite**.

```
gym-dashboard-fullstack/
├── backend/
│   ├── app/             # FastAPI app: rutas, modelos, esquemas, seed
│   ├── requirements.txt
│   └── run.py           # entrypoint (uvicorn)
└── frontend/
    ├── index.html       # markup
    ├── styles.css       # estilos
    ├── app.js           # lógica del dashboard
    └── api.js           # cliente fetch
```

## Cómo correrlo

Requisitos: **Python 3.10+**

```powershell
cd backend
pip install -r requirements.txt
python run.py
```

Luego abrir **http://127.0.0.1:8000** en el navegador.

## Endpoints (FastAPI)

| Método | Ruta | Descripción |
|---|---|---|
| GET    | `/api/members?q=`         | Listar miembros (filtro por nombre/email) |
| POST   | `/api/members`            | Crear miembro |
| PUT    | `/api/members/{id}`       | Actualizar miembro |
| DELETE | `/api/members/{id}`       | Eliminar miembro |
| GET    | `/api/programs`           | Listar programas |
| POST   | `/api/programs`           | Crear programa |
| PUT    | `/api/programs/{id}`      | Actualizar programa |
| DELETE | `/api/programs/{id}`      | Eliminar programa |
| GET    | `/api/stats`              | Totales: miembros, activos, programas |

📘 **Documentación interactiva**: http://127.0.0.1:8000/docs (Swagger UI generado automáticamente).

## Persistencia

Los datos se guardan en `backend/gympro.db` (SQLite, creado en el primer arranque). En el primer inicio se cargan **6 miembros y 6 programas de ejemplo** (seed). Para resetear la base, eliminá el archivo `gympro.db` y reiniciá.

## Funcionalidades destacadas

- **Buscador en vivo**: el input del topbar filtra por nombre, email o disciplina y actualiza la tabla en tiempo real. Si estás en otra vista, salta automáticamente a la lista de Miembros.
- **Registro de miembros**: el formulario "Registrarse" (lateral izquierdo → Acceso → Registrarse) crea un miembro nuevo en la base de datos. Aparece al instante en la tabla y queda persistido entre recargas.
- **Stats reactivos**: el contador "Miembros Activos" del dashboard se actualiza con cada alta.
- **Sección "Mi Perfil"**: ajustada para que el banner y el avatar no se superpongan con la barra superior.

## Stack

- **Backend**: FastAPI 0.115, SQLAlchemy 2.0, Pydantic 2, SQLite, Uvicorn.
- **Frontend**: HTML + CSS + JS vanilla, ApexCharts (CDN), Plus Jakarta Sans.
