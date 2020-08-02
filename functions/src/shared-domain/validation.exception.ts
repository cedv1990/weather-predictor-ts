import { ValidationError } from './validation.error';

export class ValidationException extends Error {
  
  private errors: Array<ValidationError>;

  constructor(errors: Array<ValidationError>) {
    super('ValidationError');
    this.errors = errors;
  }

  public getErrors(): Array<ValidationError> {
    return this.errors;
  }
}