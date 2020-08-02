import { ValidationException } from '../../../shared-domain/validation.exception';
import { SolarSystemValidator } from './solarsystem.validator';
import { SolarSystem } from './solarsystem';

export class SolarSystemFactory{
    public static create(days: number): SolarSystem {
        const solarSystemValidator = new SolarSystemValidator();
        const solarSystem = new SolarSystem(days);

        if (!solarSystemValidator.validate(solarSystem)) {
            const errors = solarSystemValidator.getErrors();
            throw new ValidationException(errors);
        }

        return solarSystem;
    }
}