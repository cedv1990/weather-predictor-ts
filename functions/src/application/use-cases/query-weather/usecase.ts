import { SolarSystemRepository } from '../../../modules/solarsystem/domain/solarsystem.repository';
import { Command } from './command';
import { Responder } from './responder';

export class UseCase {
    
    constructor(private solarsystemRepository: SolarSystemRepository) {
        
    }
    
    async execute(command: Command, responder: Responder): Promise<void> {
        try {
            const addedSolarSystem = await this.solarsystemRepository.getDay(command.get());

            await responder.weatherFound(addedSolarSystem);
        }
        catch(e) {
            const errors = e.getErrors ? e.getErrors() : [e];
            await responder.weatherNotFound(errors);
        }
    }
}