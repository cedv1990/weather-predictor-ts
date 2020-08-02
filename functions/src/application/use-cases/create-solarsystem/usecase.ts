import { SolarSystemRepository } from '../../../modules/solarsystem/domain/solarsystem.repository';
import { Command } from './command';
import { Responder } from './responder';
import { SolarSystemFactory } from '../../../modules/solarsystem/domain/solarsystem.factory';
import { UseCaseBase } from '../usecasebase';

export class UseCase implements UseCaseBase {
    
    constructor(private solarsystemRepository: SolarSystemRepository) {
        
    }
    
    async execute(command: Command, responder: Responder): Promise<void> {
        try {
            const solarSystem = SolarSystemFactory.create(command.get());
            const addedSolarSystem = await this.solarsystemRepository.create(solarSystem);

            await responder.solarsystemSuccessfullyCreated(addedSolarSystem);
        }
        catch(e) {
            const errors = e.getErrors ? e.getErrors() : [e];
            await responder.solarsystemNotCreated(errors);
        }
    }
}