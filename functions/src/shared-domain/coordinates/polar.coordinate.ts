/**
 * Clase que contiene las coordenadas polares de un punto.
 * @class
 */
export class PolarCoordinate {
    /**
     * @constructor
     * @param {number} radius @property Radio de la coordenada.
     * @param {number} grades @property Grados de la coordenada.
     */
    constructor(public radius: number, public grades: number) {

    }

    /**
     * Método para sumarle grados a los grados actuales.
     * @param {number} quantity Cantidad de grados a aumentar.
     */
    public addGrades(quantity: number): void {
        this.grades += quantity;
    }

    /**
     * Método para normalizar los grados. Ej.: Si hay 380°, este método los convierte a 20°.
     * No se usa porque varían los datos por culpa de la constante Math.PI para
     * el cálculo de los radianes, etc.
     * @deprecated
     */
    private normalizeGrades(): void {
        this.grades %= 360;
    }
}