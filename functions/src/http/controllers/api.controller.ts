import { FirestoreSolarSystemRepository } from '../../modules/solarsystem/infraestructure/persistence/firestore/firestoresolarsystem.repository';
import { UseCase as CreateSolarSystemUseCase } from '../../application/use-cases/create-solarsystem/usecase';
import { UseCase as QueryWeatherUseCase } from '../../application/use-cases/query-weather/usecase';
import { InMemorySolarSystemRepository } from '../../modules/solarsystem/infraestructure/persistence/in-memory/inmemorysolarsystem.repository';
import { UseCaseBase } from '../../application/use-cases/usecasebase';

export class ApiController {
    private useCases: Map<string, UseCaseBase> = new Map<string, UseCaseBase>();

    public static firestoreSolarSystemRepository: FirestoreSolarSystemRepository = new FirestoreSolarSystemRepository();
    public static inmemorySolarSystemRepository: InMemorySolarSystemRepository = new InMemorySolarSystemRepository();
    private static databaseType: string = process.env.database_type as string;

    constructor() {
        let solarSystemRepo = ApiController.firestoreSolarSystemRepository;

        if (ApiController.databaseType && ApiController.databaseType === 'inMemory') {
            solarSystemRepo = ApiController.inmemorySolarSystemRepository;
        }

        this.useCases.set('createSolarSystem', new CreateSolarSystemUseCase(solarSystemRepo));
        this.useCases.set('queryWeather', new QueryWeatherUseCase(solarSystemRepo));
    }

    protected getUseCase(name: string): UseCaseBase {
        return this.useCases.get(name);
    }
}