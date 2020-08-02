import { Star } from './value-objects/star';
import { Weather } from './value-objects/weather';
import { WeatherCondition } from './value-objects/weathercondition.enum';

export class SolarSystem {
    public sun: Star;
    public days: Array<Weather>;
    public daysWithMaxRain: Array<number>;
    public maxPerimeter: number;
    public dryDays: number;
    public rainyDays: number;
    public optimalDays: number;
    public normalDays: number;

    constructor(days: number) {
        this.sun = new Star('Sun');
        this.days = new Array<Weather>();
        this.createPrediction(days);
        this.calculateMaxPerimeterDryOptimalRainyHighintensityDays();
        this.setPeaks();
    }

    private createPrediction(days: number) {
        for (let i = 0; i < days; i++) {
            this.days.push(new Weather(this.sun, i));
        }
    }

    private setPeaks() {
        this.daysWithMaxRain.forEach(day => this.days[day].weatherCondition = WeatherCondition.picoLluvia);
    }

    private calculateMaxPerimeterDryOptimalRainyHighintensityDays() {
        const rainyDays = this.filterByWeatherCondition(WeatherCondition.lluvia);
        const dryDays = this.filterByWeatherCondition(WeatherCondition.sequia);
        const optimalDays = this.filterByWeatherCondition(WeatherCondition.optima);

        this.maxPerimeter = Math.max.apply(null, rainyDays.map(x => x.perimeter));

        this.daysWithMaxRain = rainyDays.filter(x => x.perimeter == this.maxPerimeter).map(x => x.day);

        this.rainyDays = rainyDays.length;

        this.dryDays = dryDays.length;

        this.optimalDays = optimalDays.length;

        this.normalDays = this.days.length - (rainyDays.length + dryDays.length + optimalDays.length);
    }

    private filterByWeatherCondition(condition: WeatherCondition): Array<Weather> {
        return this.days.filter(x => x.weatherCondition === condition);
    }
}