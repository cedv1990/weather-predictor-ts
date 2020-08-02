import { PolarCoordinate } from './coordinate/polar.coordinate';

export class Star {
    public polarCoordinate?: PolarCoordinate;

    constructor(
        public name: string,
        public distance: number = 0,
        public grades: number = 0,
        public velocity?: number,
        public clockwise?: boolean) {
        this.polarCoordinate = new PolarCoordinate(this.distance, this.grades);
    }

    public nextPosition(dayNumber: number) {
        if (this.clockwise) {
            this.polarCoordinate.addGrades(-this.velocity * dayNumber);
        }
        else {
            this.polarCoordinate.addGrades(this.velocity * dayNumber);
        }
    }
}