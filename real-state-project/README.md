# TuHogar

Aplicación inmobiliaria con catálogo público y panel de gestión. Desarrollada con Angular 13, Angular Material y json-server.

## Ejecutar en local

Instala las dependencias con `npm ci` y ejecuta `npm run start:all`. La web se abre en http://localhost:4200 y la API escucha en http://localhost:3000.

Los datos se guardan en `src/assets/data/DB.json`. json-server modifica ese archivo al enviar formularios y gestionar viviendas. Para hacer demostraciones con reservas y ventas conviene trabajar con una copia.

## Funciones

- Catálogo con filtros, favoritos de sesión y comparador de dos o tres viviendas.
- Contactos con solicitudes de información, visita o reserva.
- Solicitudes de valoración vinculadas a la ficha del propietario en clientes.
- Seguimiento con mensajes, notas, estados y operaciones por vivienda.
- Reserva, cancelación y venta asociadas a un cliente, con historial y fecha.
- Tres gráficas: comparativa mensual de ventas de 2020 a 2023, viviendas y clientes por estado. La comparativa utiliza la colección histórica de ventas de ejemplo.

La reserva solicitada desde el catálogo debe confirmarla un agente. En el panel, una reserva antigua sin cliente requiere vincularlo antes de registrar la venta. El estado del cliente se gestiona de forma independiente al de sus viviendas.

## Comprobaciones

- `npm run build:dev`: compila la aplicación en desarrollo.
- `npm run test:ci`: ejecuta Jasmine y Karma en Chrome Headless y genera cobertura en `coverage/real-state-project`.
- `npm test`: abre el entorno interactivo de pruebas.

Chrome debe estar instalado para las pruebas. El prototipo usa autenticación local de demostración y no aplica permisos en la API. Las comprobaciones de las operaciones se realizan en Angular; un backend propio debe resolver la seguridad y las reservas simultáneas antes de un uso real.
