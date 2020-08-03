import { CreateSolarSystemController } from './controllers/solarsystem/createsolarsystem.controller';
import { QueryWeatherController } from './controllers/weather/queryweather.controller';

/**
 ** Este es el archivo de entrada de los endpoints.
 ** Se puede ver en la configuración del archivo ubicado en @see "dist/package.json", propiedad "main".
 **/

/**
 * Se exporta el método del controlador {@link CreateSolarSystemController} para el endpoint /generar-prediccion
 */
export const generatePredictions = CreateSolarSystemController.generatePredictions;

/**
 * Se exporta el método del controlador {@link QueryWeatherController} para el endpoint /clima?dia=n
 */
export const getSpecificDayWeather = QueryWeatherController.getSpecificDayWeather;