import { CommandBase } from "../commandbase";

export class Command implements CommandBase {
    constructor(private solarSystemDays: number) {

    }

    public get(): number {
        return this.solarSystemDays;
    }
}