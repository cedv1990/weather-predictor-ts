import { ResponderBase } from './responderbase';
import { CommandBase } from './commandbase';

/**
 * Interfaz creada para definir los métodos necesarios para implementar los casos de uso.
 * Se puede ver su uso en el @see Map creado en la propiedad de la clase {@link ApiController#useCases}
 * @interface
 */
export interface UseCaseBase {

    /**
     * Método a implementar.
     * @param {CommandBase} command Recibe una instancia que implemente la interfaz que contiene los comandos necesarios.
     * @param {ResponderBase} responder Instancia que implementa la interfaz que contiene los métodos de respuesta.
     * @returns {Promise<void>}
     */
    execute(command: CommandBase, responder: ResponderBase): Promise<void>;
}