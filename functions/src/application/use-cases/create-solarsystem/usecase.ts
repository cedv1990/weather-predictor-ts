import { SolarSystemRepository } from '../../../modules/solarsystem/domain/solarsystem.repository';
import { Command } from './command';
import { Responder } from './responder';
import { SolarSystemFactory } from '../../../modules/solarsystem/domain/solarsystem.factory';
import { UseCaseBase } from '../usecasebase';

/**
 * Clase que expone métodos necesarios para cumplir con los casos de uso de create-solarsystem.
 * @implements {UseCaseBase}
 * @class
 */
export class UseCase implements UseCaseBase {
    
    /**
     * @constructor
     * @param {SolarSystemRepository} solarsystemRepository Instancia que implementa la interfaz que 
     * contiene las funcionalidades del gestor de la persistencia de los datos.
     */
    constructor(private solarsystemRepository: SolarSystemRepository) {
        
    }
    
    /**
     * Método que invoca el comando que obtiene los días que se generarán. Luego, realiza el llamado
     * del método de creación del repositorio, el cual persiste los datos ya sea en memoria o en Firebase.
     * @param {Command} command Instancia que implementa la interfaz que contiene los comandos necesarios.
     * @param {Responder} responder Instancia que implementa la interfaz que contiene los métodos de respuesta.
     * Dicha instancia es del controlador {@link CreateSolarSystemController}.
     * @returns {Promise<void>}
     */
    async execute(command: Command, responder: Responder): Promise<void> {
        try {
            /**
             * Se crea la instancia de {@link SolarSystem} mediante el llamado de {@link SolarSystemFactory}.
             */
            const solarSystem = SolarSystemFactory.create(command.get());

            /**
             * Se realiza el llamado al manejador del repositorio {@link SolarSystemRepository} el cual
             * realiza la persistencia de los datos.
             */
            const addedSolarSystem = await this.solarsystemRepository.create(solarSystem);

            /**
             * Se pasa el sistema solar que se guardó en el repositorio al {@link Responder}.
             */
            await responder.solarsystemSuccessfullyCreated(addedSolarSystem);
        }
        catch(e) {
            const errors = e.getErrors ? e.getErrors() : [e];

            /**
             * Si ocurrió algún error en los pasos anteriores, se envían al {@link Responder}.
             */
            await responder.solarsystemNotCreated(errors);
        }
    }
}