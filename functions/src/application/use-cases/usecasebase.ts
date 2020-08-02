import { ResponderBase } from './responderbase';
import { CommandBase } from './commandbase';

export interface UseCaseBase {
    execute(command: CommandBase, responder: ResponderBase): any;
}