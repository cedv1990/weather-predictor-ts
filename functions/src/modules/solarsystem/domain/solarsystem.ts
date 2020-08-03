import { Star } from './value-objects/star';
import { Weather } from './value-objects/weather';
import { WeatherCondition } from './value-objects/weathercondition.enum';

/**
 * Clase encargada del encapsulamiento de los datos correspondientes al sistema solar que 
 * contiene la lista de todos los días de la predicción.
 * @class
 */
export class SolarSystem {
    /**
     * Instancia del Sol
     * @property {Star}
     */
    public sun: Star;

    /**
     * Lista de todos los días con su predicción.
     * @property {Array<Weather>}
     */
    public days: Array<Weather>;

    /**
     * Lista de todos los días con picos de lluvia.
     * @property {Array<number>}
     */
    public daysWithMaxRain: Array<number>;

    /**
     * Valor del máximo perímetro encontrado.
     * @property {number}
     */
    public maxPerimeter: number;

    /**
     * Cantidad de días de sequía.
     * @property {number}
     */
    public dryDays: number;

    /**
     * Cantidad de días de lluvia.
     * @property {number}
     */
    public rainyDays: number;

    /**
     * Cantidad de días de condiciones óptimas de presión y temperatura.
     * @property {number}
     */
    public optimalDays: number;

    /**
     * Cantidad de días de condiciones normales.
     * @property {number}
     */
    public normalDays: number;

    /**
     * @constructor
     * @param {number} days Número de días que se van a predecir.
     */
    constructor(days: number) {
        this.sun = new Star('Sun');
        this.days = new Array<Weather>();

        this.createPrediction(days);
        this.calculateRelevanDataFromDays();
        this.setPeaks();
    }

    /**
     * Agrega las predicciones a la lista de días que las contiene.
     * @param {number} days Número de días que se van a predecir.
     */
    private createPrediction(days: number): void {
        for (let i = 0; i < days; i++) {
            this.days.push(new Weather(this.sun, i));
        }
    }

    /**
     * Método para extraer los datos relevantes de los días calculados.
     * Se calcula:
     * - Días de lluvia.
     * - Días de sequía.
     * - Días óptimos.
     * - Perímetro máximo.
     * - Picos de lluvia. Días en los cuales los planetas forman un triángulo con ese perímetro máximo.
     * - Días normales.
     */
    private calculateRelevanDataFromDays(): void {
        /**
         * Se filtran los días por su condición climática.
         */
        const rainyDays     = this.filterByWeatherCondition(WeatherCondition.rain);
        const dryDays       = this.filterByWeatherCondition(WeatherCondition.dry);
        const optimalDays   = this.filterByWeatherCondition(WeatherCondition.optimal);

        /**
         * Se obtiene el perímetro máximo de todos los días de lluvia.
         */
        this.maxPerimeter = Math.max.apply(null, rainyDays.map(x => x.perimeter));

        /**
         * Se filtran los días de lluvia que tengan ese valor de perímetro máximo.
         * Luego, se extrae solo el número de día.
         */
        this.daysWithMaxRain = rainyDays.filter(x => x.perimeter == this.maxPerimeter).map(x => x.day);

        /**
         * Se asignan los totales.
         */

        this.rainyDays = rainyDays.length;

        this.dryDays = dryDays.length;

        this.optimalDays = optimalDays.length;

        this.normalDays = this.days.length - (rainyDays.length + dryDays.length + optimalDays.length);
    }

    /**
     * Método para filtrar los días por su condición climática.
     * @param {WeatherCondition} condition Condición climática que se desea filtrar.
     * @returns {Array<Weather>}
     */
    private filterByWeatherCondition(condition: WeatherCondition): Array<Weather> {
        return this.days.filter(x => x.weatherCondition === condition);
    }

    /**
     * Cambia el estado del clima de los días que han sido encontrados como picos de lluvia.
     */
    private setPeaks(): void {
        this.daysWithMaxRain.forEach(day => this.days[day].weatherCondition = WeatherCondition.rainPeak);
    }
}