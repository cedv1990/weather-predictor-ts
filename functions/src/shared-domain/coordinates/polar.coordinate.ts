export class PolarCoordinate {
    constructor(public radius: number, public grades: number) {

    }

    public addGrades(quantity: number) {
        this.grades += quantity;
    }

    private normalizeGrades() {
        this.grades %= 360;
    }
}