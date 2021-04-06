# Titulo: Backend SESPO
---
## Overview: Problema a resolver
La empresa Construtec, requiere un sistema que pueda generar reportes (formatos pdf establecidos),  con la información que ingresan sus usuarios mediante una app movil.

Los usuario del aplicativo ingresan los datos a la app, esta la almacena en  una base de datos, el usuario mediante el aplicativo solicita la generación de reportes, en ese instante la app movil transfiere todos los datos al backend para que este genere los reportes y los envie al correo del usuario.

En el backend tambien debe ser capaz de almacenar los datos sincronizados por parte del usuario.

### Alcance(Scope)
Descripción..

#### Casos de uso
* Como usuario me gustaria poder obtener mis reportes en formato pdf.
* Como usuario me gustaria tener en respaldo de la información que  ingrese.
* Como usuario no suscrito me gustaria poder generer algunos reportes de prueba.


#### Out of Scope (casos de uso No Soportados)
* Como usuario no suscrito me gusta poder generar toods los reportes.

---
## Arquitectura

### Diagramas
poner diagramas de secuencia, uml, etc

### Modelo de datos
Poner diseño de entidades, Jsons, tablas, diagramas entidad relación, etc..

---
## Limitaciones
* EL envio de los reportes de pdf no debe demorar mas de 1 min.
* Los datos deben permanecer almaceneados hasta 1mes despues de que el usuario se da de baja.
---
## Costo
"Considerando 100 usuarios suscritos:"
* 1 servicio de cloud. $5.00
Total: $5.00 (al mes)