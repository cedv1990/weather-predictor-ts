# Descripción del ejercicio

En una galaxia lejana, existen tres civilizaciones. Vulcanos, Ferengis y Betasoides. Cada civilización vive en paz en su respectivo planeta.

Dominan la predicción del clima mediante un complejo sistema informático.

A continuación el diagrama del sistema solar.

<p align="center">
    <img alt="Sistema solar" src="https://raw.githubusercontent.com/cedv1990/weather-predictor-ts/master/assets/solar-system.jpg">
</p>

### Premisas

- El planeta **Ferengi** se desplaza con una velocidad angular de **1 grados/día** en sentido **horario**. Su distancia con respecto al sol es de **500Km**.

- El planeta **Vulcano** se desplaza con una velocidad angular de **5 grados/día** en sentido **anti­horario**. Su distancia con respecto al sol es de **1000Km**.

- El planeta **Betasoide** se desplaza con una velocidad angular de **3 grados/día** en sentido **horario**. Su distancia con respecto al sol es de **2000Km**.

- Todas las órbitas son circulares.

Cuando los **tres planetas están alineados entre sí y a su vez alineados con respecto al sol**, el sistema solar experimenta un período de ***sequía***.

<p align="center">
    <img alt="Sequía" src="https://raw.githubusercontent.com/cedv1990/weather-predictor-ts/master/assets/dry.jpg">
</p>

Cuando los **tres planetas no están alineados**, forman entre sí un **triángulo**. Es sabido que en el momento en el que el **sol se encuentra dentro del triángulo**, el sistema solar experimenta un período de ***lluvia***, teniendo éste, un ***pico de intensidad*** cuando el perímetro del ***triángulo está en su máximo***.

<p align="center">
    <img alt="Lluvia" src="https://raw.githubusercontent.com/cedv1990/weather-predictor-ts/master/assets/rain.jpg">
</p>

Las condiciones ***óptimas de presión y temperatura*** se dan cuando los **tres planetas están alineados entre sí pero no están alineados con el sol**.

<p align="center">
    <img alt="Óptimo" src="https://raw.githubusercontent.com/cedv1990/weather-predictor-ts/master/assets/optimal.jpg">
</p>

Se debe desarrollar un programa que pueda predecir la siguiente información en los ***próximos 10 años***:

1. ¿Cuántos períodos de sequía habrá?
2. ¿Cuántos períodos de lluvia habrá y qué día será el pico máximo de lluvia?
3. ¿Cuántos períodos de condiciones óptimas de presión y temperatura habrá?

Para poder utilizar el sistema como un **servicio a las otras civilizaciones**, los ***Vulcanos*** requieren tener una **base de datos** con las condiciones meteorológicas de todos los días y brindar una **API REST** de consulta sobre las condiciones de un **día en particular**.

# ¿Cómo probar la solución de este repositorio?

El proyecto consta de 2 carpetas de aplicación ([functions](https://github.com/cedv1990/weather-predictor-ts/tree/master/functions) y [test-server](https://github.com/cedv1990/weather-predictor-ts/tree/master/test-server)) y una carpeta para los recursos de esta documentación ([assets](https://github.com/cedv1990/weather-predictor-ts/tree/master/assets)).

Una vez se clona o descarga el proyecto, se deben seguir los comandos a continuación.

**Prerequisitos:** Tener instalado ***npm***. [Clic aquí para ver cómo](https://www.npmjs.com/get-npm).

1. Preparación de proyecto [functions](https://github.com/cedv1990/weather-predictor-ts/tree/master/functions).

    - Ubicar la consola en la carpeta functions:

        ```console
        ~\weather-predictor> cd functions
        ```

    - Instalar dependencias:

        ```console
        ~\weather-predictor\functions> npm install
        ```

    - Transpilar el código de Typescript a Javascript:

        ```console
        ~\weather-predictor\functions> npm run build
        ```

2. Preparación de proyecto [test-server](https://github.com/cedv1990/weather-predictor-ts/tree/master/test-server).

    - Ubicar la consola en la carpeta test-server:

        ```console
        ~\weather-predictor\functions> cd ..\test-server
        ```

    - Instalar dependencias:

        ```console
        ~\weather-predictor\test-server> npm install
        ```

    - Subir el servidor express:

        ```console
        ~\weather-predictor\test-server> node app.js
        ```

        Esto creará un servidor node js que se encuentra corriendo en [http://localhost:1234/](http://localhost:1234/). En la consola se muestra un mensaje así:

        ```console
        ~\weather-predictor\test-server> node app.js
        Corriendo en 1234!
        inMemory
        ```

        La palabra **inMemory** significa que el servidor guardará la información que se genere en memoria. Esta configuración se encuentra en el archivo ***[.env](https://github.com/cedv1990/weather-predictor-ts/tree/master/test-server/.env)***, el cual una vez se despliegue ***[functions](https://github.com/cedv1990/weather-predictor-ts/tree/master/functions)*** a ***Google Cloud Platform***, éste no estará configurado y la información se almacenará en ***[Firestore](https://firebase.google.com/docs/firestore?hl=es)***.

    Una vez levantado el servidor, éste tendrá 2 endpoints, los cuales estarán utilizando las clases generadas en el proyecto [functions](https://github.com/cedv1990/weather-predictor-ts/tree/master/functions).

3. La aplicación que se encuentra en ejecución en [http://localhost:1234/](http://localhost:1234/) contiene los siguientes *endpoints*:

    - Generación de los datos.

        - Método HTTP: ***GET***
        - Url: [http://localhost:1234/generar-prediccion](http://localhost:1234/generar-prediccion)
        - Controlador: [CreateSolarSystemController](https://github.com/cedv1990/weather-predictor-ts/blob/master/functions/src/http/controllers/solarsystem/createsolarsystem.controller.ts)
        - Método: *generatePredictions*
        - [Códigos de respuesta](https://developer.mozilla.org/es/docs/Web/HTTP/Status):

            [201 Created](https://developer.mozilla.org/es/docs/Web/HTTP/Status/201): El sistema solar y los datos del clima de 10 años han sido cargados correctamente.

            ```javascript
            {
                "created": true,
                "data": {
                    "aysWithMaxRain": [
                        2808,
                        2952,
                        3492
                    ],
                    "dryDays": 21,
                    "maxPerimeter": 6262.300354242005,
                    "normalDays": 2389,
                    "optimalDays": 40,
                    "rainyDays": 1202
                }
            }
            ```

            [200 OK](https://developer.mozilla.org/es/docs/Web/HTTP/Status/200): El sistema solar y los datos del clima de 10 años ya se han cargado con anterioridad.

            ```javascript
            {
                "message": "The solar system was already created. Congrats!"
            }
            ```

            [500 Internal Server Error](https://developer.mozilla.org/es/docs/Web/HTTP/Status/500): Ocurrió un error en el cargue de datos. El cuerpo de respuesta varía dependiendo del error. Se puede deber a conexión con la base de datos u otros procesos que no fueron controlados.

    - Consulta de los datos.

        - Método HTTP: ***GET***
        - Url: http://localhost:1234/clima?dia=n
        - Controlador: [QueryWeatherController](https://github.com/cedv1990/weather-predictor-ts/blob/master/functions/src/http/controllers/weather/querysolarsystem.controller.ts)
        - Método: *getSpecificDayWeather*
        - [Códigos de respuesta](https://developer.mozilla.org/es/docs/Web/HTTP/Status):

            [200 OK](https://developer.mozilla.org/es/docs/Web/HTTP/Status/200): El día solicitado en el [Query String](https://es.wikipedia.org/wiki/Query_string) fue encontrado exitosamente y se envía el estado del clima en el cuerpo. Ejemplo: [http://localhost:1234/clima?dia=566](http://localhost:1234/clima?dia=566)

            ```javascript
            {
                "dia": 566,
                "clima": "lluvia"
            }
            ```

            [401 Unathorized](https://developer.mozilla.org/es/docs/Web/HTTP/Status/401): El código de respuesta se debe a que la petición fue realizada sin el parámetro ***?dia=n***. Ejemplo: [http://localhost:1234/clima](http://localhost:1234/clima)

            [404 Not Found](https://developer.mozilla.org/es/docs/Web/HTTP/Status/404): El código de respuesta se debe a que la petición fue realizada con un número de día que no se encuentra en la base de datos o la información aún no se ha cargado con el endpoint anterior. Ejemplo: [http://localhost:1234/clima?dia=6000](http://localhost:1234/clima?dia=6000)

            ```javascript
            {
                "message": "The day does not exist!"
            }
            ```

            [500 Internal Server Error](https://developer.mozilla.org/es/docs/Web/HTTP/Status/500): Ocurrió un error en la consulta del dato. El cuerpo de respuesta varía dependiendo del error. Se puede deber a conexión con la base de datos u otros procesos que no fueron controlados.

    **NOTA:** Para probar los endpoints en ***Google Cloud Platform***, es necesario cambiar el dominio de los endpoints en el navegador, así:
    
    - [https://us-central1-august-period-284822.cloudfunctions.net/generar-predicciones](https://us-central1-august-period-284822.cloudfunctions.net/generar-predicciones)
    - [https://us-central1-august-period-284822.cloudfunctions.net/clima?dia=566](https://us-central1-august-period-284822.cloudfunctions.net/clima?dia=566)

## Arquitectura implementada

La arquitectura implementada es **Hexagonal** de la mano de **DDD**, **CQRS** sin olvidar los principios **SOLID**.