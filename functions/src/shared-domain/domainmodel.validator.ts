import { ValidationError } from './validation.error';

export interface DomainModelValidator<T> {
    validate(model: T): boolean;
    getErrors(): Array<ValidationError>;
}