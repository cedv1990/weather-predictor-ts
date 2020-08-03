import { SolarSystemRepository } from '../../../modules/solarsystem/domain/solarsystem.repository';
import { Command } from './command';
import { Responder } from './responder';
import { UseCaseBase } from '../usecasebase';

/**
 * Clase que expone métodos necesarios para cumplir con los casos de uso de query-weather.
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
     * Método que invoca el comando que obtiene el estado del clima de un día específico. 
     * @param {Command} command Instancia que implementa la interfaz que contiene los comandos necesarios.
     * @param {Responder} responder Instancia que implementa la interfaz que contiene los métodos de respuesta.
     * Dicha instancia es del controlador {@link QueryWeatherController}.
     * @returns {Promise<void>}
     */
    async execute(command: Command, responder: Responder): Promise<void> {
        try {
            /**
             * Se realiza el llamado al manejador del repositorio {@link SolarSystemRepository} el cual
             * realiza la consulta de los datos.
             */
            const addedSolarSystem = await this.solarsystemRepository.getDay(command.get());

            /**
             * Se pasa el estado del clima del día encontrado en el repositorio al {@link Responder}.
             */
            await responder.weatherFound(addedSolarSystem);
        }
        catch(e) {
            const errors = e.getErrors ? e.getErrors() : [e];

            /**
             * Si ocurrió algún error en los pasos anteriores, se envían al {@link Responder}.
             */
            await responder.weatherNotFound(errors);
        }
    }
}