import { CommandBase } from "../commandbase";

/**
 * Clase para implementar la interfaz {@link CommandBase}.
 * @implements {CommandBase}
 * @class
 */
export class Command implements CommandBase {

    /**
     * @constructor
     * @param {number} solarSystemDays Cantidad de días a generar.
     */
    constructor(private solarSystemDays: number) {

    }

    /**
     * Obtiene el número de días que se necesita para generar la predicción.
     * @returns {number}
     * @method
     */
    public get(): number {
        return this.solarSystemDays;
    }
}