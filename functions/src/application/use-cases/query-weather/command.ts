import { CommandBase } from "../commandbase";

export class Command implements CommandBase {
    constructor(private day: number) {

    }

    public get(): number {
        return this.day;
    }
}