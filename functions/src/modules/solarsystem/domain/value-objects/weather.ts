import { Star } from "./star";
import { WeatherCondition } from "./weathercondition.enum";
import { CartesianCoordinate } from "../../../../shared-domain/coordinates";
import { Utils } from "../../../../shared-domain/utils";

/**
 * Clase encargada del encapsulamiento de los datos correspondientes a un día específico en la predicción.
 * @class
 */
export class Weather {

    /**
     * Planetas del ejercicio.
     * @property {Star}
     */
    public betasoide: Star;
    public vulcano: Star;
    public ferengi: Star;

    /**
     * Se parte del supuesto de que los planetas están alineados, por lo que esta propiedad cambia su valor
     * si los planetas no están alineados.
     * @property {number}
     */
    public perimeter: number = 0;

    /**
     * Se parte del supuesto de que el día tiene condiciones climáticas normales.
     * @property {WeatherCondition}
     */
    public weatherCondition: WeatherCondition = WeatherCondition.normal;

    /**
     * @constructor
     * @param {Star} sun @property
     * @param {number} day @property
     */
    constructor(private sun: Star, public day: number) {
        this.initializeStars();
        this.setPositionByDayNumber();
    }

    /**
     * Método para inicializar los planetas con su respectiva configuración.
     */
    private initializeStars(): void {
        /**
         * Se instancian los planetas con:
         * Nombre
         * Distancia al sol
         * Grados
         * Velocidad (grados por día)
         * Movimiento con respecto a las manecillas del reloj
         */
        this.betasoide  = new Star('Betasoide', 2000, 0, 3, true);
        this.vulcano    = new Star('Vulcano', 1000, 0, 5, false);
        this.ferengi    = new Star('Ferengi', 500, 0, 1, true);
    }

    /**
     * Método para asignar las posiciones correspondientes de los planetas dependiendo del número de día.
     */
    private setPositionByDayNumber(): void {
        /**
         * Llamado al método que realiza el cálculo de la posición del planeta con respecto al número de día.
         */
        this.betasoide.setPositionByDayNumber(this.day);
        this.vulcano.setPositionByDayNumber(this.day);
        this.ferengi.setPositionByDayNumber(this.day);

        /**
         * Llamado al cálculo de la condición climática del día dependiendo de la posición de los planetas.
         */
        this.setWeatherCondition();
    }

    /**
     * Método para calcular la coordenada cartesiana a partir de la coordenada polar.
     * @param {Star} star Estrella a la cual se le calculará la coordenada cartesiana.
     * @returns {CartesianCoordinate}
     */
    private calculateCartesianCoordinateFromStar(star: Star): CartesianCoordinate {
        /**
         * Llamado del método de cálculo presente en la clase {@link Utils}.
         */
        return Utils.getCartesianCoordinateFromPolarCoordinate(star.polarCoordinate);
    }

    /**
     * Método encargado de asignar la condición climática del día.
     */
    private setWeatherCondition(): void {
        /**
         * Se obtienen las coordenadas cartesianas de cada planeta a partir de sus coordenadas polares.
         */
        const betasoideCartesianCoordinate   = this.calculateCartesianCoordinateFromStar(this.betasoide);
        const vulcanoCartesianCoordinate     = this.calculateCartesianCoordinateFromStar(this.vulcano);
        const ferengiCartesianCoordinate     = this.calculateCartesianCoordinateFromStar(this.ferengi);
        const sunCartesianCoordinate         = this.calculateCartesianCoordinateFromStar(this.sun);

        /**
         * Se realiza el llamado del método que devuelve la función que calcula la pendiente de la recta
         * formada a partir del planeta más lejano (Betasoide).
         */
        const functionToCalculateSlope = Utils.generateFunctionToCalculateSlope(betasoideCartesianCoordinate);

        /**
         * Se calculan las pendientes de las 3 rectas formadas a partir del planeta más lejano (Betasoide).
         */
        const slopeBetasoideFerengi  = functionToCalculateSlope(ferengiCartesianCoordinate);
        const slopeBetasoideVulcano  = functionToCalculateSlope(vulcanoCartesianCoordinate);
        const slopeBetasoideSun      = functionToCalculateSlope(sunCartesianCoordinate);

        /**
         * Se comparan las pendientes entre betasoide-ferengi y betasoide-vulcano.
         * Si son iguales, quiere decir que los 3 planetas están alineados.
         */
        if (slopeBetasoideFerengi === slopeBetasoideVulcano) {
            /**
             * Se compara la pendiente de cualquier recta formada entre los planetas con la pendiente
             * formada entre el planeta más lejano (Betasoide) y el Sol.
             * Si son iguales, quiere decir que los 3 planetas están alineados con el sol, lo cual
             * significa que habrá sequía.
             * Si son diferentes, quiere decir que los 3 planetas están alineados pero no con el sol, lo
             * cual significa que habrán condiciones óptimas de presión y temperatura.
             */
            if (slopeBetasoideFerengi === slopeBetasoideSun) {
                this.weatherCondition = WeatherCondition.dry;
            }
            else {
                this.weatherCondition = WeatherCondition.optimal;
            }
        }
        else {
            /**
             * Al no estár alineados, los planetas forman un triángulo.
             * Para calcular el perímetro de cualquier triángulo, se requiere conocer la longitud de sus lados,
             * para así sumarlos y hallar el valor.
             */

            /**
             * Se calculan las distancias entre los 3 planetas.
             */
            const distanceBetasoideFerengi  = Utils.getDistanceBetweenPoints(betasoideCartesianCoordinate, ferengiCartesianCoordinate);
            const distanceBetasoideVulcano  = Utils.getDistanceBetweenPoints(betasoideCartesianCoordinate, vulcanoCartesianCoordinate);
            const distanceVulcanoFerengi    = Utils.getDistanceBetweenPoints(vulcanoCartesianCoordinate, ferengiCartesianCoordinate);

            /**
             * Se calcula el perímetro del triángulo, mediante la suma de sus lados.
             * Posteriormente, se revisará en la clase {@link SolarSystem} el perímetro más alto,
             * lo cual servirá para detectar los días con picos altos de lluvia; éstos corresponden
             * a aquellos días que compartan ese valor del perímetro mayor.
             */
            this.perimeter = distanceBetasoideFerengi + distanceBetasoideVulcano + distanceVulcanoFerengi;

            /**
             * Se realiza el llamado al método encargado de revisar si el sol se encuentra dentro del triángulo
             * formado entre los 3 planetas.
             * Si lo está, quiere decir que la condición del clima será de lluvia.
             */
            if (Utils.evaluateIfPointIsInsideTheTriangle(betasoideCartesianCoordinate, ferengiCartesianCoordinate, vulcanoCartesianCoordinate, sunCartesianCoordinate)) {
                this.weatherCondition = WeatherCondition.rain;
            }
        }
    }
}