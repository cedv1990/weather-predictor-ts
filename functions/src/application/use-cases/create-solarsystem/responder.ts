import { SolarSystem } from '../../../modules/solarsystem/domain/solarsystem';
import { ValidationError } from '../../../shared-domain/validation.error';
import { ResponderBase } from '../responderbase';

export interface Responder extends ResponderBase {
    solarsystemSuccessfullyCreated(solar: SolarSystem): void;
    solarsystemNotCreated(errors: Array<ValidationError>): void;
}