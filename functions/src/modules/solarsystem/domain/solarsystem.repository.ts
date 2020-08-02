import { SolarSystem } from './solarsystem';
import { Weather } from './value-objects/weather';

export interface SolarSystemRepository {
    create(solarSystem: SolarSystem): Promise<SolarSystem>;
    exists(): Promise<boolean>;
    getDay(day: number): Promise<Weather>;
}