import { PolarCoordinate, CartesianCoordinate } from './coordinates';
import { ReturnFunction } from './returnfunction';

/**
 * Clase con métodos estáticos que realizan cálculos.
 * @class
 */
export class Utils {

    /**
     * Método que calcula la cantidad de días que existe entre el día actual y los años que
     * lleguen como argumento.
     * @param {number} years 
     * @static
     * @returns {number}
     */
    public static getDaysFromNumberOfYears(years: number): number {
        /**
         * Día actual
         */
        const today = new Date();

        /**
         * Día actual X años adelante.
         */
        const tenYearsAhead = new Date(today.getFullYear() + years, today.getMonth(), today.getDate());

        /**
         * Se calcula la diferencia en milisegundos y luego se transforma en valor de días.
         */
        const days = (tenYearsAhead.getTime() - today.getTime()) / (1000 * 3600 * 24);

        return days;
    }

    /**
     * Método que calcula las coordenadas cartesianas a partir de coordenadas polares.
     * @param {PolarCoordinate} polar Coordenada polar
     * @static
     * @returns {CartesianCoordinate}
     */
    public static getCartesianCoordinateFromPolarCoordinate(polar: PolarCoordinate): CartesianCoordinate {
        /**
         * Se calculan los radianes: (G° * PI) / 180°
         */
        const radiansAngle = polar.grades * Math.PI / 180;

        /**
         * Se calcula la posición de X: R * COS(θ)
         */
        const x = polar.radius * Math.cos(radiansAngle);

        /**
         * Se calcula la posición de Y: R * SIN(θ)
         */
        const y = polar.radius * Math.sin(radiansAngle);

        /**
         * Se retorna encapsulado en {@link CartesianCoordinate}
         */
        return new CartesianCoordinate(x, y);
    }

    /**
     * Método que devuelve la función que calcula la pendiente formada entre dos puntos, a partir de sus
     * coordenadas cartesianas.
     * @param {CartesianCoordinate} from Coordenadas cartesianas pertenecientes al punto inicial.
     * @static
     * @returns {ReturnFunction<CartesianCoordinate, number>}
     */
    public static generateFunctionToCalculateSlope(from: CartesianCoordinate): ReturnFunction<CartesianCoordinate, number> {
        /**
         * @param {CartesianCoordinate} to Punto final con el cual se calculará la pendiente.
         * @returns {number}
         */
        return (to: CartesianCoordinate): number => {
            const   x1 = from.x,
                    y1 = from.y,
                    x2 = to.x,
                    y2 = to.y;

            const m = Utils.getSlope(x1, y1, x2, y2);

            /**
             * Se aproxima la pendiente obtenida a 1 solo dígito decimal para lograr que las pendientes
             * de los planetas coincidan, emulando el posible diámetro de cada uno de ellos.
             * Sin este redondeo, los planetas jamás se alinean por culpa de PI.
             */
            return Utils.round(m, 10);
        };
    }

    /**
     * Método que calcula la pendiente a partir de dos puntos cardenales.
     * @param {number} x1 
     * @param {number} y1 
     * @param {number} x2 
     * @param {number} y2 
     * @static
     * @returns {number}
     */
    public static getSlope(x1: number, y1: number, x2: number, y2: number): number {
        /**
         * Fórmula de la pendiente de una recta.
         */
        return (y2 - y1) / (x2 - x1);
    }

    /**
     * Método para aproximar números y convertir un número a X cantidad de dígitos decimales.
     * @param {number} decimal Valor que se desea aproximar.
     * @param {number} to Cantidad de números decimales base 10.
     * @static
     * @returns {number}
     */
    public static round(decimal: number, to: number): number {
        /**
         * Se redondea el número multiplicado por la cantidad de números decimales base 10 y
         * su resultado se divide en la misma cantidad.
         */
        return Math.round(decimal * to) / to;
    }

    /**
     * Método que calcula la distancia que hay entre 2 puntos cartesianos.
     * @param {CartesianCoordinate} from Coordenada cartesiana inicial.
     * @param {CartesianCoordinate} to Coordenada cartesiana final.
     * @static
     * @returns {number}
     */
    public static getDistanceBetweenPoints(from: CartesianCoordinate, to: CartesianCoordinate): number {
        /**
         * Teorema de pitágoras: h = √ (x^2 + y^2)
         * Longitud x = x2 - x1
         * Longitud y = y2 - y1
         */
        return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
    }

    /**
     * Método que evalúa si un punto P se encuentra dentro del perímetro de un triángulo
     * formado por los puntos A + B + C.
     * @param {CartesianCoordinate} a Coordenada cartesiana A.
     * @param {CartesianCoordinate} b Coordenada cartesiana B.
     * @param {CartesianCoordinate} c Coordenada cartesiana C.
     * @param {CartesianCoordinate} p Coordenada cartesiana del punto a evaluar.
     * @static
     * @returns {boolean}
     */
    public static evaluateIfPointIsInsideTheTriangle(a: CartesianCoordinate, b: CartesianCoordinate, c: CartesianCoordinate, p: CartesianCoordinate): boolean {
        /**
         * Fórmula tomada de {@link "https://huse360.home.blog/2019/12/14/como-saber-si-un-punto-esta-dentro-de-un-triangulo/"}
         */

        /**
         * Segmento del triángulo resultado de B - A
         */
        const d = new CartesianCoordinate( b.x - a.x, b.y - a.y );

        /**
         * Segmento del triángulo resultado de C - A
         */
        const e = new CartesianCoordinate( c.x - a.x, c.y - a.y );

        /**
         * Variable de ponderación a ~ b (Vector de "a" hacia "b". Segmento que sumado a w2 da la ubicación de P)
         * w1 = (Ex*(Ay + Py) + Ey*(Px - Ax)) / (Dx*Ey - Dy*Ex)
         */
        const w1 = (e.x * (a.y - p.y) + e.y * (p.x - a.x)) / (d.x * e.y - d.y * e.x);

        /**
         * Variable de ponderación a ~ c (Vector de "a" hacia "c". Segmento que sumado a w1 da la ubicación de P)
         * w2 = (1 / Ey) * (Py - Ay - w1*Dy)
         */
        const w2 = (p.y - a.y - w1 * d.y) / e.y;

        /**
         * Si el vector w1 es positivo o igual a 0 y
         * si el vetor w2 es positivo o igual a 0 y
         * si la suma de ambos no excede 1.0,
         * quiere decir que el punto no está por fuera de los límites
         * del triángulo.
         */
        return (w1 >= 0.0) && (w2 >= 0.0) && ((w1 + w2) <= 1.0);
    }
}