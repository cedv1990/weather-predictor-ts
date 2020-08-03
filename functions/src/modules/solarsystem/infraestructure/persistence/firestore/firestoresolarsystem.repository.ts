import { SolarSystemRepository } from '../../../domain/solarsystem.repository';
import { SolarSystem } from '../../../domain/solarsystem';
import { AlreadyExistsError, NotExistsError } from '../../../../../shared-domain/validation.error';
import { Weather } from '../../../domain/value-objects/weather';

const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const doc = db.collection('weather-predictions').doc('predictions');

/**
 * Clase encargada de la persistencia de datos en Firestore.
 * @implements {SolarSystemRepository}
 * @class
 */
export class FirestoreSolarSystemRepository implements SolarSystemRepository {

    /**
     * Método para almacenar los datos generados en Firestore.
     * @param {SolarSystem} solarSystem 
     * @async
     * @returns {Promise<SolarSystem>}
     */
    public async create(solarSystem: SolarSystem): Promise<SolarSystem> {
        /**
         * Se valida si ya hay datos para no volver a guardar.
         */
        if (await this.exists()) {
            return Promise.reject({ is: true } as AlreadyExistsError);
        }

        /**
         * Se crea un batch para guardar datos por lotes.
         */
        let batch = db.batch();

        /**
         * Se extraen las propiedades del sistema solar
         */
        const {
            days,
            maxPerimeter,
            dryDays,
            rainyDays,
            optimalDays,
            normalDays,
            daysWithMaxRain
        } = solarSystem;

        /**
         * Se asignan los datos al documento "predictions"
         */
        batch.set(doc, {
            maxPerimeter,
            dryDays,
            rainyDays,
            optimalDays,
            normalDays,
            daysWithMaxRain
        });

        /**
         * Se recorren los días generados.
         */
        for (let i = 0; i < days.length; i++) {

            /**
             * Se extraen las propiedades del día.
             */
            const {
                day,
                ferengi,
                betasoide,
                vulcano,
                weatherCondition,
                perimeter
            } = days[i];

            /**
             * Se genera el documento con id del número de día correspondiente.
             * Si la colección "days" no existe, Firestore lo crea antes del documento.
             */
            const document = doc.collection('days').doc(day.toString());

            /**
             * Se asignan los datos al documento N de la colección "days"
             */
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

            /**
             * El batch no soporta muchas transacciones por vez.
             * Se envían cada 400 datos.
             */
            if (i % 400 == 0) {
                await batch.commit();
                batch = db.batch();
            }
        }

        await batch.commit();

        return Promise.resolve(solarSystem);
    }

    /**
     * Método para validar si ya existen datos en Firestore.
     * @async
     * @returns {Promise<boolean>}
     */
    public async exists(): Promise<boolean> {
        /**
         * Se obtiene el documento "predictions" y éste tiene la propiedad "exists" sin necesidad de 
         * traer sus datos.
         */
        const document = await doc.get();
        return Promise.resolve(document.exists);
    }

    /**
     * Método para obtener el estado del clima de un día específico.
     * @param {number} day Número de día que se quiere recuperar de Firestore.
     * @async
     * @returns {Promise<Weather>}
     */
    public async getDay(day: number): Promise<Weather> {
        /**
         * Se obtiene la colección "days". Luego el documento identificado por el número de día.
         */
        const document = await db.collection(`weather-predictions/predictions/days`).doc(day.toString()).get();

        /**
         * Se valida si el día (documento) existe existe.
         */
        if (!document.exists) {
            return Promise.reject({ no: true } as NotExistsError);
        }

        /**
         * Se extrae la condición climática del día.
         */
        const {
            weatherCondition
        } = document.data();

        /**
         * Se encapsulan los 2 datos que se quieren devolver en {@link Weather}
         */
        const weather = {
            day,
            weatherCondition
        } as Weather;

        return Promise.resolve(weather);
    }
}