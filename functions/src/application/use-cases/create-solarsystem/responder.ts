import { SolarSystem } from '../../../modules/solarsystem/domain/solarsystem';
import { ValidationError } from '../../../shared-domain/validation.error';
import { ResponderBase } from '../responderbase';

/**
 * Interfaz que se implementará en el controlador {@link CreateSolarSystemController}.
 * 
 * Métodos utilizados como posibles respuestas en el caso de uso {@link UseCase} de create-solarsystem.
 * 
 * @extends ResponderBase
 * @interface
 */
export interface Responder extends ResponderBase {
    /**
     * Método que se invocará al lograr crear y guardar los datos.
     * @param {SolarSystem} solar Instancia que se almacenará.
     */
    solarsystemSuccessfullyCreated(solar: SolarSystem): void;

    /**
     * Método que se invocará al recibir un error en el intento de crear y guardar los datos.
     * @param {Array<ValidationError>} errors Lista de todos los errores generados.
     */
    solarsystemNotCreated(errors: Array<ValidationError>): void;
}