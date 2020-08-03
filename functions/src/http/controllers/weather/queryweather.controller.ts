import { ApiController } from '../api.controller';
import { Responder } from '../../../application/use-cases/query-weather/responder';
import { ValidationError } from '../../../shared-domain/validation.error';
import { UseCase } from '../../../application/use-cases/query-weather/usecase';
import { Command } from '../../../application/use-cases/query-weather/command';
import { Weather } from '../../../modules/solarsystem/domain/value-objects/weather';

/**
 * Clase encargada de recibir las solicitudes del endpoint /clima?dia=n
 * @extends ApiController
 * @implements {Responder}
 * @class
 */
export class QueryWeatherController extends ApiController implements Responder {
    
    /**
     * Propiedad estática privada que se usará para obtener el nombre del caso de uso al que pertenece
     * este controlador.
     * @static
     * @type {string}
     */
    private static useCaseName: string = 'queryWeather';

    /**
     * Propiedad privada de la clase la cual contiene la instancia generada en la consulta
     * del clima de un día específico.
     * Ésta se asigna en el método implementado weatherFound.
     * @property {Weather}
     */
    private weather: Weather;

    /**
     * Método que recibe la solicitud web del endpoint /clima?dia=n
     * @param request Objeto que contiene la solicitud web.
     * @param response Objeto que se usará para el envío de las respuestas.
     * @static
     * @async
     * @returns {Promise<void>}
     */
    public static async getSpecificDayWeather(request: any, response: any): Promise<void> {
        /**
         * Se valida si viene el Query String.
         */
        if (request.query.dia) {
            const _this = new QueryWeatherController();
            try {
                const dia = parseInt(request.query.dia);

                /**
                 * Se invoca el método getDayWeatherFromSolarSystem para obtener la condición
                 * climática del día.
                 */
                const { weatherCondition } = await _this.getDayWeatherFromSolarSystem(dia);
                
                /**
                 * Respuesta con código http 200 (Ok).
                 * Contiene el día que se consultó y la predicción del clima para ese día.
                 */
                response.status(200).json({
                    dia,
                    clima: weatherCondition
                });
            }
            catch (e) {
                /**
                 * Se valida si en alguno de los errores hay uno que corresponda al tipo @type {NotExistsError} por su propiedad "no".
                 * Esto significa que la predicción para ese día no existe en el repositorio.
                 */
                if (e.errors.some((error: any) => error.no)) {
                    /**
                     * Respuesta con código http 404 (Not Found).
                     * Mensaje con texto que dice que no existe el día en las predicciones.
                     */
                    response.status(404).json({
                        message: 'The day does not exist!'
                    });
                }
                else {
                    /**
                     * Respuesta con código 500 (Internal Server Error).
                     * Se muestran los errores en el cuerpo de la respuesta.
                     */
                    response.status(500).json(e);
                }
            }
        }
        else {
            /**
             * Respuesta con código http 401 (Unathorized).
             * El método no es válido si no tiene el parámetro dia=n
             */
            response.sendStatus(401);
        }
    }

    /**
     * Método que se encarga de obtener el caso de uso, el comando correspondiente y la ejecución del caso de uso.
     * @param {number} day Número de día a consultar.
     * @async
     * @returns {Promise<Weather>}
     */
    private async getDayWeatherFromSolarSystem(day: number): Promise<Weather> {
        /**
         * Se obtiene el caso de uso y se instancia el comando con el número de día a consultar.
         */
        const queryWeatherUseCase = this.getQueryWeatherUseCase();
        const queryWeatherCommand = new Command(day);

        /**
         * Ejecuta el método del caso de uso con el comando y el responder, que en este caso es la instancia del controlador.
         */
        await queryWeatherUseCase.execute(queryWeatherCommand, this);

        /**
         * Si el llamado anterior fue correcto, se debío llamar el método "weatherFound" 
         * el cual asigna el valor a la propiedad.
         */
        return this.weather;
    }

    /**
     * Método implementado de la interfaz {@link Responder}.
     * El método es llamado por el caso de uso {@link UseCase}.
     * @param {Weather} weather Instancia creada y almacenada por el Repository.
     */
    public weatherFound(weather: Weather): void {
        this.weather = weather;
    }

    /**
     * Método implementado de la interfaz {@link Responder}.
     * El método es llamado por el caso de uso {@link UseCase} cuando ocurren errores.
     * @param {Array<ValidationError>} errors Lista de errores encontrados.
     */
    public weatherNotFound(errors: Array<ValidationError>): void {
        const e = <any>new Error('ValidationError');
        e.errors = errors;

        /**
         * Se lanza el error para que el método estático controle el error y envíe el 
         * código de respuesta respectivo.
         */
        throw e;
    }

    /**
     * Método que obtiene el caso de uso por el nombre de la propiedad estática "useCaseName".
     * @returns {UseCase}
     */
    private getQueryWeatherUseCase(): UseCase {
        /**
         * Se realiza el llamado al método de la super clase {@link ApiController} que obtiene el 
         * caso de uso respectivo.
         */
        return super.getUseCase(QueryWeatherController.useCaseName) as UseCase;
    }
}