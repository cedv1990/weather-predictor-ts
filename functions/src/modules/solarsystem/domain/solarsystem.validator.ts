import { SolarSystem } from './solarsystem';
import { DomainModelValidator } from '../../../shared-domain/domainmodel.validator';
import { ValidationError } from '../../../shared-domain/validation.error';

/**
 * Clase creada para la validación de erores en el proceso de creación de la instancia de {@link SolarSystem}.
 * @implements {DomainModelValidator<SolarSystem>}
 * @class
 */
export class SolarSystemValidator implements DomainModelValidator<SolarSystem> {

    /**
     * Lista que contienen todos los errores ocurridos en el proceso de creación de las predicciones.
     * @property {Array<ValidationError>}
     */
    private errors: Array<ValidationError> = [];

    /**
     * Método para validar el modelo o la cantidad de errores que ocurrieron en el proceso de creación de las 
     * predicciones.
     * @param {SolarSystem} model Modelo a validar. En estos momentos, no se está teniendo en cuenta, pero se 
     * deja por si en un futuro se debe utilizar para validar alguna configuración.
     * @returns {boolean}
     */
    public validate(model: SolarSystem): boolean {
        return this.errors.length === 0;
    }

    /**
     * Método que retorna la lista de errores.
     * @returns {Array<ValidationError>}
     */
    public getErrors(): Array<ValidationError> {
        return this.errors;
    }
    
}