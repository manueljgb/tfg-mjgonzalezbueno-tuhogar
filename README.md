# TuHogar · TFG

Aplicación inmobiliaria con Angular 13 y json-server. Incluye catálogo, filtros, favoritos, comparación de viviendas y formularios de contacto y valoración. El panel permite gestionar viviendas y clientes, registrar reservas, cancelaciones y ventas, y consultar tres gráficas de actividad.

## Ejecutar el proyecto

El código de la aplicación está en `real-state-project`. Desde la raíz del repositorio:

```sh
cd real-state-project
npm ci
npm run start:all
```

La web se abre en http://localhost:4200 y la API utiliza http://localhost:3000. Las credenciales de demostración están en la colección `users` de `real-state-project/src/assets/data/DB.json`.

json-server guarda los cambios en ese archivo. Para realizar pruebas con reservas y ventas, utiliza una copia de los datos. El acceso al panel es una demostración local; no protege la API para un despliegue público.

Consulta las [instrucciones de la aplicación](real-state-project/README.md) para conocer los flujos implementados y ejecutar la compilación y las pruebas.

## Datos de demostración

Los nombres, teléfonos, correos e identificadores personales de las colecciones de ejemplo se han sustituido por valores ficticios. Las ventas históricas son datos de demostración, no operaciones comerciales reales. Sus filtros permiten combinar precio, ubicación y tipo de vivienda.

Acceso local al panel: usuario `admin`, contraseña `admin`.
