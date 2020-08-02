import { SolarSystem } from '../../../modules/solarsystem/domain/solarsystem';
import { ValidationError } from '../../../shared-domain/validation.error';
import { ResponderBase } from '../responderbase';
import { Weather } from '../../../modules/solarsystem/domain/value-objects/weather';

export interface Responder extends ResponderBase {
    weatherFound(weather: Weather): void;
    weatherNotFound(errors: Array<ValidationError>): void;
}