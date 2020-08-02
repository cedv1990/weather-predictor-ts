import { ApiController } from '../api.controller';
import { Responder } from '../../../application/use-cases/query-weather/responder';
import { ValidationError } from '../../../shared-domain/validation.error';
import { UseCase } from '../../../application/use-cases/query-weather/usecase';
import { Command } from '../../../application/use-cases/query-weather/command';
import { Weather } from '../../../modules/solarsystem/domain/value-objects/weather';

export class QueryWeatherController extends ApiController implements Responder {
    private static useCaseName: string = 'queryWeather';

    private weather: Weather;

    static async getSpecificDayWeather(request: any, response: any) {
        if (request.query.dia) {
            const _this = new QueryWeatherController();
            try {
                const dia = parseInt(request.query.dia);
                const weather = await _this.getDayWeatherFromSolarSystem(dia);
                response.status(200).json({
                    dia,
                    clima: weather.weatherCondition
                });
            }
            catch (e) {
                if (e.errors.some((error: any) => error.no)) {
                    response.status(404).json({
                        message: 'The day does not exist!'
                    });
                }
                else {
                    response.status(500).json(e);
                }
            }
        }
        else {
            response.sendStatus(401);
        }
    }

    async getDayWeatherFromSolarSystem(day: number) {
        const queryWeatherUseCase = this.getQueryWeatherUseCase();
        const queryWeatherCommand = new Command(day);
        await queryWeatherUseCase.execute(queryWeatherCommand, this);

        return this.weather;
    }

    public weatherFound(weather: Weather) {
        this.weather = weather;
    }

    public weatherNotFound(errors: Array<ValidationError>) {
        const e = <any>new Error('ValidationError');
        e.errors = errors;
        throw e;
    }

    private getQueryWeatherUseCase(): UseCase {
        return this.getUseCase(QueryWeatherController.useCaseName) as UseCase;
    }
}