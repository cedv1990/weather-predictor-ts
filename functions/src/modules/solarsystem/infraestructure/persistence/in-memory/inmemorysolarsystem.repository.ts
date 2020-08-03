import { SolarSystemRepository } from '../../../domain/solarsystem.repository';
import { SolarSystem } from '../../../domain/solarsystem';
import { AlreadyExistsError, NotExistsError } from '../../../../../shared-domain/validation.error';
import { Weather } from '../../../domain/value-objects/weather';

/**
 * Clase encargada de la persistencia de datos en memoria.
 * @implements {SolarSystemRepository}
 * @class
 */
export class InMemorySolarSystemRepository implements SolarSystemRepository {
    /**
     * Propiedad que tendrá en memoria los datos.
     * @property {SolarSystem}
     * @static
     */
    private static repo: SolarSystem;

    constructor() {
        InMemorySolarSystemRepository.repo = null;
    }

    /**
     * Método para almacenar los datos generados en memoria.
     * @param {SolarSystem} solarSystem 
     * @async
     * @returns {Promise<SolarSystem>}
     */
    public async create(solarSystem: SolarSystem): Promise<SolarSystem> {
        /**
         * Se valida si ya hay datos para no volver a guardar.
         */
        if (await this.exists()) {
            return Promise.reject({ is: true } as AlreadyExistsError);
        }

        /**
         * Se guardan los datos en memoria.
         */
        InMemorySolarSystemRepository.repo = solarSystem;
        return Promise.resolve(solarSystem);
    }
    
    /**
     * Método para validar si ya existen datos en memoria.
     * @async
     * @returns {Promise<boolean>}
     */
    public async exists(): Promise<boolean> {
        return Promise.resolve(InMemorySolarSystemRepository.repo != null);
    }

    /**
     * Método para obtener el estado del clima de un día específico.
     * @param {number} day Número de día que se quiere recuperar de la memoria.
     * @async
     * @returns {Promise<Weather>}
     */
    public async getDay(day: number): Promise<Weather> {
        /**
         * Se valida si hay datos.
         */
        if (await this.exists() === false) {
            return Promise.reject({ no: true } as NotExistsError);
        }

        /**
         * Se filtra por el número de día.
         */
        const weather = InMemorySolarSystemRepository.repo.days[day];

        /**
         * Se valida si el día existe en las predicciones.
         */
        if (!weather) {
            return Promise.reject({ no: true } as NotExistsError);
        }
        return Promise.resolve(weather);
    }
}