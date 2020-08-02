import { PolarCoordinate } from "../modules/solarsystem/domain/value-objects/coordinate/polar.coordinate";
import { CartesianCoordinate } from "../modules/solarsystem/domain/value-objects/coordinate/cartesian.coordinate";

export class Utils {
    public static getDaysFromNumberOfYears(years: number): number {
        const today = new Date();
        const tenYearsAhead = new Date(today.getFullYear() + 10, today.getMonth(), today.getDate());
        const days = (tenYearsAhead.getTime() - today.getTime()) / (1000 * 3600 * 24);
        return days;
    }

    public static getCartesianCoordinateFromPolarCoordinate(polar: PolarCoordinate): CartesianCoordinate {
        const radiansAngle = polar.grades * Math.PI / 180;

        const x = polar.radius * Math.cos(radiansAngle);

        const y = polar.radius * Math.sin(radiansAngle);

        return new CartesianCoordinate(x, y);
    }

    public static getSlope(x1: number, y1: number, x2: number, y2: number): number {
        return (y2 - y1) / (x2 - x1);
    }

    public static round(decimal: number, to: number): number {
        return Math.round(decimal * to) / to;
    }

    public static getDistanceBetweenPoints(from: CartesianCoordinate, to: CartesianCoordinate): number {
        return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
    }

    public static evaluateIfPointIsInsideOfTriangle(a: CartesianCoordinate, b: CartesianCoordinate, c: CartesianCoordinate, p: CartesianCoordinate): boolean {
        const d = new CartesianCoordinate( b.x - a.x, b.y - a.y );

        const e = new CartesianCoordinate( c.x - a.x, c.y - a.y );

        const w1 = (e.x * (a.y - p.y) + e.y * (p.x - a.x)) / (d.x * e.y - d.y * e.x);
        const w2 = (p.y - a.y - w1 * d.y) / e.y;

        return (w1 >= 0.0) && (w2 >= 0.0) && ((w1 + w2) <= 1.0);
    }
}