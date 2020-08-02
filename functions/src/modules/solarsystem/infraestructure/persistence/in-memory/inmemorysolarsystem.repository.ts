import { SolarSystemRepository } from '../../../domain/solarsystem.repository';
import { SolarSystem } from '../../../domain/solarsystem';
import { AlreadyExistsError, NotExistsError } from '../../../../../shared-domain/validation.error';
import { Weather } from '../../../domain/value-objects/weather';

export class InMemorySolarSystemRepository implements SolarSystemRepository {
    private static repo: SolarSystem;

    constructor() {
        InMemorySolarSystemRepository.repo = null;
    }

    async create(solarSystem: SolarSystem): Promise<SolarSystem> {
        if (await this.exists()) {
            return Promise.reject({ is: true } as AlreadyExistsError);
        }
        InMemorySolarSystemRepository.repo = solarSystem;
        return Promise.resolve(solarSystem);
    }
    
    async exists(): Promise<boolean> {
        return Promise.resolve(InMemorySolarSystemRepository.repo != null);
    }

    async getDay(day: number): Promise<Weather> {
        if (await this.exists() === false) {
            return Promise.reject({ no: true } as NotExistsError);
        }
        const weather = InMemorySolarSystemRepository.repo.days[day];
        if (!weather) {
            return Promise.reject({ no: true } as NotExistsError);
        }
        return Promise.resolve(weather);
    }
}