import { ApiController } from '../api.controller';
import { Responder } from '../../../application/use-cases/create-solarsystem/responder';
import { SolarSystem } from '../../../modules/solarsystem/domain/solarsystem';
import { ValidationError } from '../../../shared-domain/validation.error';
import { UseCase } from '../../../application/use-cases/create-solarsystem/usecase';
import { Command } from '../../../application/use-cases/create-solarsystem/command';
import { Utils } from '../../../shared-domain/utils';

/**
 * Clase encargada de recibir las solicitudes del endpoint /generar-prediccion
 * @extends ApiController
 * @implements {Responder}
 * @class
 */
export class CreateSolarSystemController extends ApiController implements Responder {

    /**
     * Propiedad estática privada que se usará para obtener el nombre del caso de uso al que pertenece
     * este controlador.
     * @static
     * @type {string}
     */
    private static useCaseName: string = 'createSolarSystem';

    /**
     * Propiedad privada de la clase la cual contiene la instancia generada en la creación
     * de la predicción. Ésta se asigna en el método implementado solarsystemSuccessfullyCreated.
     * @property {SolarSystem}
     */
    private solarSystem: SolarSystem;

    /**
     * Método que recibe la solicitud web del endpoint /generar-prediccion
     * @param request Objeto que contiene la solicitud web.
     * @param response Objeto que se usará para el envío de las respuestas.
     * @static
     * @returns {Promise<void>}
     */
    public static async generatePredictions(request: any, response: any): Promise<void> {
        const _this = new CreateSolarSystemController();
        try {

            /**
             * Antes de realizar el llamado a generateSolarSystem, se utiliza el método de
             * la clase {@link Utils#getDaysFromNumberOfYears} para obtener el número
             * de días que hay en 10 años.
             */
            const {
                daysWithMaxRain,
                dryDays,
                maxPerimeter,
                normalDays,
                optimalDays,
                rainyDays
            } = await _this.generateSolarSystem(Utils.getDaysFromNumberOfYears(10));

            /**
             * Respuesta con código http 201 (Created).
             * Contiene los datos principales de la predicción.
             */
            response.status(201).json({
                created: true,
                data: { daysWithMaxRain, dryDays, maxPerimeter, normalDays, optimalDays, rainyDays }
            });
        }
        catch (e) {
            /**
             * Se valida si en alguno de los errores hay uno que corresponda al tipo @type {AlreadyExistsError} por su propiedad "is".
             * Esto significa que las predicciones ya se han generado anteriormente.
             */
            if (e.errors.some((error: any) => error.is)) {
                /**
                 * Respuesta con código http 200 (Ok).
                 * Mensaje con texto que dice que ya se encuentran cargadas las predicciones.
                 */
                response.status(200).json({
                    message: 'The solar system was already created. Congrats!'
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

    /**
     * Método que se encarga de obtener el caso de uso, el comando correspondiente y la ejecución del caso de uso.
     * @param {number} days Cantidad de días a predecir.
     * @returns {Promise<SolarSystem>}
     */
    private async generateSolarSystem(days: number): Promise<SolarSystem> {
        /**
         * Se obtiene el caso de uso y se instancia el comando con la cantidad de días.
         */
        const createSolarSystemUseCase = this.getCreateSolarSystemUseCase();
        const createSolarSystemCommand = new Command(days);

        /**
         * Ejecuta el método del caso de uso con el comando y el responder, que en este caso es la instancia del controlador.
         */
        await createSolarSystemUseCase.execute(createSolarSystemCommand, this);

        /**
         * Si el llamado anterior fue correcto, se debío llamar el método "solarsystemSuccessfullyCreated" 
         * el cual asigna el valor a la propiedad.
         */
        return this.solarSystem;
    }

    /**
     * Método implementado de la interfaz {@link Responder}.
     * El método es llamado por el caso de uso {@link UseCase}.
     * @param {SolarSystem} solar Instancia creada y almacenada por el Repository.
     */
    public solarsystemSuccessfullyCreated(solar: SolarSystem): void {
        this.solarSystem = solar;
    }

    /**
     * Método implementado de la interfaz {@link Responder}.
     * El método es llamado por el caso de uso {@link UseCase} cuando ocurren errores.
     * @param {Array<ValidationError>} errors Lista de errores encontrados.
     */
    public solarsystemNotCreated(errors: Array<ValidationError>): void {
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
    private getCreateSolarSystemUseCase(): UseCase {
        /**
         * Se realiza el llamado al método de la super clase {@link ApiController} que obtiene el 
         * caso de uso respectivo.
         */
        return super.getUseCase(CreateSolarSystemController.useCaseName) as UseCase;
    }
}