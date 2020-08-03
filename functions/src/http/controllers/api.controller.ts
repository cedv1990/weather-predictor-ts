import { FirestoreSolarSystemRepository } from '../../modules/solarsystem/infraestructure/persistence/firestore/firestoresolarsystem.repository';
import { UseCase as CreateSolarSystemUseCase } from '../../application/use-cases/create-solarsystem/usecase';
import { UseCase as QueryWeatherUseCase } from '../../application/use-cases/query-weather/usecase';
import { InMemorySolarSystemRepository } from '../../modules/solarsystem/infraestructure/persistence/in-memory/inmemorysolarsystem.repository';
import { UseCaseBase } from '../../application/use-cases/usecasebase';
import { SolarSystemRepository } from '../../modules/solarsystem/domain/solarsystem.repository';

/**
 * Clase que se usará para heredarse en los diferentes controladores.
 * @class
 */
export class ApiController {
    /**
     * Propiedad que almacena los diferentes casos de uso y su respectiva instancia de implementación.
     */
    private useCases: Map<string, UseCaseBase> = new Map<string, UseCaseBase>();

    /**
     * Propiedad que tiene el tipo de base de datos que se usará para la persistencia,
     * a partir de la configuración del archivo @see .env , ubicado en el proyecto test-server.
     * @static
     */
    private static databaseType: string = process.env.database_type as string;

    /**
     * Se cargan las instancias de los repositorios respectivos a la memoria.
     * @static
     */
    private static firestoreSolarSystemRepository: FirestoreSolarSystemRepository = new FirestoreSolarSystemRepository();
    private static inmemorySolarSystemRepository: InMemorySolarSystemRepository = new InMemorySolarSystemRepository();

    constructor() {
        let solarSystemRepo: SolarSystemRepository = null;

        /**
         * Se valida el tipo de base de datos para asignar la instancia del repositorio respectivo.
         */
        if (ApiController.databaseType === 'inMemory') {
            solarSystemRepo = ApiController.inmemorySolarSystemRepository;
        }
        else {
            solarSystemRepo = ApiController.firestoreSolarSystemRepository;
        }

        /**
         * Se agregan los casos de uso necesarios para los controladores.
         */
        this.useCases.set('createSolarSystem', new CreateSolarSystemUseCase(solarSystemRepo));
        this.useCases.set('queryWeather', new QueryWeatherUseCase(solarSystemRepo));
    }

    /**
     * Método para obtener el caso de uso correspondiente de cada controlador.
     * @param {string} name Nombre del caso de uso.
     * @returns {UseCaseBase}
     */
    protected getUseCase(name: string): UseCaseBase {
        return this.useCases.get(name);
    }
}