import { ValidationError } from './validation.error';

/**
 * Interfaz que define los métodos necesarios para validar un modelo.
 * @type {T}
 * @interface
 */
export interface DomainModelValidator<T> {

    /**
     * Método para validar el modelo o la cantidad de errores que ocurrieron en el proceso.
     * @param {T} model Modelo a validar.
     * @returns {boolean}
     */
    validate(model: T): boolean;

    /**
     * Método que retorna la lista de errores.
     * @returns {Array<ValidationError>}
     */
    getErrors(): Array<ValidationError>;
}