import { SolarSystem } from './solarsystem';
import { Weather } from './value-objects/weather';

/**
 * Interfaz que contiene las definiciones de los métodos que debe exponer el repositorio del sistema solar.
 * @interface
 */
export interface SolarSystemRepository {

    /**
     * Método para almacenar los datos generados en base de datos.
     * @param {SolarSystem} solarSystem Instancia del sistema solar para persistir en base de datos.
     * @async
     * @returns {Promise<SolarSystem>}
     */
    create(solarSystem: SolarSystem): Promise<SolarSystem>;

    /**
     * Método para validar si ya existen datos en el repositorio.
     * Significa que si ya hay datos, no se deben guardar de nuevo.
     * @async
     * @returns {Promise<boolean>}
     */
    exists(): Promise<boolean>;

    /**
     * Método para obtener el estado del clima de un día específico.
     * @param {number} day Número de día que se quiere recuperar de la base de datos.
     * @async
     * @returns {Promise<Weather>}
     */
    getDay(day: number): Promise<Weather>;
}