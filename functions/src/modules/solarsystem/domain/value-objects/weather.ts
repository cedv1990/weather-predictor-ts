import { Star } from "./star";
import { WeatherCondition } from "./weathercondition.enum";
import { CartesianCoordinate } from "./coordinate/cartesian.coordinate";
import { Utils } from "../../../../shared-domain/utils";
import { ReturnFunction } from "../../../../shared-domain/returnfunction";

export class Weather {
    public ferengi: Star;
    public betasoide: Star;
    public vulcano: Star;
    public weatherCondition: WeatherCondition = WeatherCondition.normal;
    public perimeter: number = 0;

    constructor(private sun: Star, public day: number) {
        this.initializeStars();
        this.setPosition();
    }

    private initializeStars() {
        this.ferengi = new Star('Ferengi', 500, 0, 1, true);
        this.betasoide = new Star('Betasoide', 2000, 0, 3, true);
        this.vulcano = new Star('Vulcano', 1000, 0, 5, false);
    }

    private setPosition() {
        this.ferengi.nextPosition(this.day);
        this.betasoide.nextPosition(this.day);
        this.vulcano.nextPosition(this.day);
        this.setWeatherCondition();
    }

    private extractCartesianCoordinate(star: Star) {
        return Utils.getCartesianCoordinateFromPolarCoordinate(star.polarCoordinate);
    }

    private setWeatherCondition() {
        const betasoideCoordinate = this.extractCartesianCoordinate(this.betasoide);
        const ferengiCoordinate = this.extractCartesianCoordinate(this.ferengi);
        const vulcanoCoordinate = this.extractCartesianCoordinate(this.vulcano);
        const sunCoordinate = this.extractCartesianCoordinate(this.sun);

        const functionToCalculateSlope = this.generateFunctionToCalculateSlope(betasoideCoordinate);

        const betasoideFerengi  = functionToCalculateSlope(ferengiCoordinate);
        const betasoideVulcano  = functionToCalculateSlope(vulcanoCoordinate);
        const betasoideSun      = functionToCalculateSlope(sunCoordinate);

        if (betasoideFerengi === betasoideVulcano) {
            if (betasoideFerengi === betasoideSun) {
                this.weatherCondition = WeatherCondition.sequia;
            }
            else {
                this.weatherCondition = WeatherCondition.optima;
            }
        }
        else {
            const distanceBetasoideFerengi = this.calculateDistanceBetweenPoints(betasoideCoordinate, ferengiCoordinate);
            const distanceBetasoideVulcano = this.calculateDistanceBetweenPoints(betasoideCoordinate, vulcanoCoordinate);
            const distanceVulcanoFerengi = this.calculateDistanceBetweenPoints(vulcanoCoordinate, ferengiCoordinate);

            this.perimeter = distanceBetasoideFerengi + distanceBetasoideVulcano + distanceVulcanoFerengi;

            if (this.evaluateIfSunIsInside(betasoideCoordinate, ferengiCoordinate, vulcanoCoordinate, sunCoordinate)) {
                this.weatherCondition = WeatherCondition.lluvia;
            }
        }
    }

    private generateFunctionToCalculateSlope(from: CartesianCoordinate): ReturnFunction<CartesianCoordinate, number> {
        return (to: CartesianCoordinate): number => {
            const   x1 = from.x,
                    y1 = from.y,
                    x2 = to.x,
                    y2 = to.y;

            const m = Utils.getSlope(x1, y1, x2, y2);

            return Utils.round(m, 10);
        };
    }

    private calculateDistanceBetweenPoints(from: CartesianCoordinate, to: CartesianCoordinate): number {
        return Utils.getDistanceBetweenPoints(from, to);
    }

    private evaluateIfSunIsInside(betasoidePoint: CartesianCoordinate, ferengiPoint: CartesianCoordinate, vulcanoPoint: CartesianCoordinate, sunPoint: CartesianCoordinate): boolean {
        return Utils.evaluateIfPointIsInsideOfTriangle(betasoidePoint, ferengiPoint, vulcanoPoint, sunPoint);
    }
}