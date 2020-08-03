/**
 * Interfaz para lograr definir los parámetros comandos en la interfaz {@link UseCaseBase}
 * @interface
 */
export interface CommandBase {

    /**
     * Método a implementar, el cual retorna un número de día.
     * @returns {number}
     */
    get(): number;
}