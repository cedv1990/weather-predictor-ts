import { ValidationException } from '../../../shared-domain/validation.exception';
import { SolarSystemValidator } from './solarsystem.validator';
import { SolarSystem } from './solarsystem';

/**
 * Clase encargada de realizar la instancia de la clase {@link SolarSystem}.
 * @class
 */
export class SolarSystemFactory {

    /**
     * Método encargado de la creación de la instancia de {@link SolarSystem}.
     * Valida que no se encuentren errores. 
     * Si los encuentra, lanza la excepción con todos los errores para ser controlada en {@link UseCase#execute}.
     * @param {number} days Cantidad de días para generar la predicción.
     * @static
     * @returns {SolarSystem}
     */
    public static create(days: number): SolarSystem {
        /**
         * Se instancia el validador, el cual dice si hay o no errores.
         */
        const solarSystemValidator = new SolarSystemValidator();

        /**
         * Se realiza la instancia de la clase {@link SolarSystem}, la cual realiza todos los cálculos correspondientes
         * a las predicciones dependiendo de la cantidad de días que se envíe.
         */
        const solarSystem = new SolarSystem(days);

        /**
         * Se buscan errores que hayan ocurrido. (errores.length > 0)
         */
        if (!solarSystemValidator.validate(solarSystem)) {
            const errors = solarSystemValidator.getErrors();
            throw new ValidationException(errors);
        }

        /**
         * Se retorna la instancia generada con todas las predicciones.
         */
        return solarSystem;
    }
}