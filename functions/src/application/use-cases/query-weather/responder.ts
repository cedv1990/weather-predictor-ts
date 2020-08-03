import { ValidationError } from '../../../shared-domain/validation.error';
import { ResponderBase } from '../responderbase';
import { Weather } from '../../../modules/solarsystem/domain/value-objects/weather';

/**
 * Interfaz que se implementará en el controlador {@link QueryWeatherController}.
 * 
 * Métodos utilizados como posibles respuestas en el caso de uso {@link UseCase} de query-weather.
 * 
 * @extends ResponderBase
 * @interface
 */
export interface Responder extends ResponderBase {

    /**
     * Método que se invocará al lograr crear y guardar los datos.
     * @param {Weather} weather Instancia del estado del clima del día específico.
     */
    weatherFound(weather: Weather): void;

    /**
     * Método que se invocará al recibir un error en el intento de obtener el estado del clima del día.
     * @param {Array<ValidationError>} errors Lista de todos los errores generados.
     */
    weatherNotFound(errors: Array<ValidationError>): void;
}