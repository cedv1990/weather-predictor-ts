import { SolarSystem } from './solarsystem';
import { DomainModelValidator } from '../../../shared-domain/domainmodel.validator';
import { ValidationError } from '../../../shared-domain/validation.error';

export class SolarSystemValidator implements DomainModelValidator<SolarSystem> {
    private errors: Array<ValidationError> = [];

    public validate(model: SolarSystem): boolean {
        return this.errors.length === 0;
    }

    public getErrors(): Array<ValidationError> {
        return this.errors;
    }
    
}