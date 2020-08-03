/**
 * Interfaz definida para lograr establecer un tipo de retorno en {@link Utils#generateFunctionToCalculateSlope}.
 * @type {TInput} Tipo del argumento de la función a retornar.
 * @type {TReturn} Tipo del objeto que retorna la función.
 * @interface
 */
export interface ReturnFunction<TInput, TReturn> {
    /**
     * Función que se retornará en el método.
     * @param {TInput} input
     * @returns {TReturn}
     */
    (input: TInput): TReturn;
}