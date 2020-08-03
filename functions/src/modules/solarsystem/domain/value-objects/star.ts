import { PolarCoordinate } from '../../../../shared-domain/coordinates';

/**
 * Entidad encargada del encapsulamiento de las propiedades de cada estrella.
 */
export class Star {
    public polarCoordinate: PolarCoordinate;

    constructor(
        public name: string,
        distance: number = 0,
        public grades: number = 0,
        public velocity?: number,
        public clockwise?: boolean) {
        this.polarCoordinate = new PolarCoordinate(distance, this.grades);
    }

    /**
     * Método encargado de asignar la nueva coordenada polar de la estrella a partir de un número de día.
     * @param {number} dayNumber Número de día de la predicción.
     */
    public setPositionByDayNumber(dayNumber: number): void {
        /**
         * Se valida si la estrella (planeta) gira con la manecillas del reloj.
         * Si lo hace, los grados deben ser negativos.
         */
        if (this.clockwise) {
            this.polarCoordinate.addGrades(-this.velocity * dayNumber);
        }
        else {
            this.polarCoordinate.addGrades(this.velocity * dayNumber);
        }
    }
}