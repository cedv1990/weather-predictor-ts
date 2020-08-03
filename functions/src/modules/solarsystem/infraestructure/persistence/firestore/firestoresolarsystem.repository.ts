import { SolarSystemRepository } from '../../../domain/solarsystem.repository';
import { SolarSystem } from '../../../domain/solarsystem';
import { AlreadyExistsError, NotExistsError } from '../../../../../shared-domain/validation.error';
import { Weather } from '../../../domain/value-objects/weather';

const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const doc = db.collection('weather-predictions').doc('predictions');

export class FirestoreSolarSystemRepository implements SolarSystemRepository {
    async create(solarSystem: SolarSystem): Promise<SolarSystem> {
        if (await this.exists()) {
            return Promise.reject({ is: true } as AlreadyExistsError);
        }
        let batch = db.batch();
        const {
            days,
            maxPerimeter,
            dryDays,
            rainyDays,
            optimalDays,
            normalDays,
            daysWithMaxRain
        } = solarSystem;

        batch.set(doc, {
            maxPerimeter,
            dryDays,
            rainyDays,
            optimalDays,
            normalDays,
            daysWithMaxRain
        });

        for (let i = 0; i < days.length; i++) {
            const {
                day,
                ferengi,
                betasoide,
                vulcano,
                weatherCondition,
                perimeter
            } = days[i];

            const document = doc.collection('days').doc(day.toString());

            batch.set(document, {
                ferengiVelocity: ferengi.velocity,
                ferengiClockwise: ferengi.clockwise,
                ferengiPolarR: ferengi.polarCoordinate.radius,
                ferengiPolarG: ferengi.polarCoordinate.grades,
                betasoideVelocity: betasoide.velocity,
                betasoideClockwise: betasoide.clockwise,
                betasoidePolarR: betasoide.polarCoordinate.radius,
                betasoidePolarG: betasoide.polarCoordinate.grades,
                vulcanoVelocity: vulcano.velocity,
                vulcanoClockwise: vulcano.clockwise,
                vulcanoPolarR: vulcano.polarCoordinate.radius,
                vulcanoPolarG: vulcano.polarCoordinate.grades,
                weatherCondition,
                perimeter
            });

            if (i % 400 == 0) {
                await batch.commit();
                batch = db.batch();
            }
        }

        await batch.commit();

        return Promise.resolve(solarSystem);
    }

    async exists(): Promise<boolean> {
        const document = await doc.get();
        return Promise.resolve(document.exists);
    }

    async getDay(day: number): Promise<Weather> {
        const document = await db.collection(`weather-predictions/predictions/days`).doc(day.toString()).get();
        if (!document.exists) {
            return Promise.reject({ no: true } as NotExistsError);
        }
        const {
            weatherCondition
        } = document.data();

        const weather = {
            day,
            weatherCondition
        } as Weather;

        return Promise.resolve(weather);
    }
}