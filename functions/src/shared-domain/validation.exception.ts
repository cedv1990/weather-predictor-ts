import { ValidationError } from './validation.error';

/**
 * Clase que encapsula errores.
 * @extends Error
 * @class
 */
export class ValidationException extends Error {
  
  /**
   * Lista de errores.
   * @property {Array<ValidationError>}
   */
  private errors: Array<ValidationError>;

  /**
   * @constructor
   * @param {Array<ValidationError>} errors 
   */
  constructor(errors: Array<ValidationError>) {
    super('ValidationError');
    this.errors = errors;
  }

  /**
   * Método que devuelve la lista de errores.
   * @returns {Array<ValidationError>}
   */
  public getErrors(): Array<ValidationError> {
    return this.errors;
  }
}