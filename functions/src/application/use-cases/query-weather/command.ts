import { CommandBase } from "../commandbase";

/**
 * Clase para implementar la interfaz {@link CommandBase}.
 * @implements {CommandBase}
 * @class
 */
export class Command implements CommandBase {

    /**
     * @constructor
     * @param {number} day @property Número de día para realizar la consulta del clima.
     */
    constructor(private day: number) {

    }

    /**
     * Obtiene el número de día que se necesita para consultar el clima en ese momento.
     * @returns {number}
     */
    public get(): number {
        return this.day;
    }
}