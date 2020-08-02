import { ApiController } from '../api.controller';
import { Responder } from '../../../application/use-cases/create-solarsystem/responder';
import { SolarSystem } from '../../../modules/solarsystem/domain/solarsystem';
import { ValidationError } from '../../../shared-domain/validation.error';
import { UseCase } from '../../../application/use-cases/create-solarsystem/usecase';
import { Command } from '../../../application/use-cases/create-solarsystem/command';
import { Utils } from '../../../shared-domain/utils';

export class CreateSolarSystemController extends ApiController implements Responder {
    private static useCaseName: string = 'createSolarSystem';

    private solarSystem: SolarSystem;

    static async generatePredictions(request: any, response: any) {
        const _this = new CreateSolarSystemController();
        try {
            const { daysWithMaxRain, dryDays, maxPerimeter, normalDays, optimalDays, rainyDays } = await _this.generateSolarSystem(Utils.getDaysFromNumberOfYears(10));
            response.status(201).json({
                created: true,
                data: { daysWithMaxRain, dryDays, maxPerimeter, normalDays, optimalDays, rainyDays }
            });
        }
        catch (e) {
            if (e.errors.some((error: any) => error.is)) {
                response.status(200).json({
                    message: 'The solar system was already created. Congrats!'
                });
            }
            else {
                response.status(500).json(e);
            }
        }
    }

    async generateSolarSystem(days: number) {
        const createSolarSystemUseCase = this.getCreateSolarSystemUseCase();
        const createSolarSystemCommand = new Command(days);
        await createSolarSystemUseCase.execute(createSolarSystemCommand, this);

        return this.solarSystem;
    }

    public solarsystemSuccessfullyCreated(solar: SolarSystem) {
        this.solarSystem = solar;
    }

    public solarsystemNotCreated(errors: Array<ValidationError>) {
        const e = <any>new Error('ValidationError');
        e.errors = errors;
        throw e;
    }

    private getCreateSolarSystemUseCase(): UseCase {
        return this.getUseCase(CreateSolarSystemController.useCaseName) as UseCase;
    }
}