import { INotFoundApplication } from "../../interfaces/1 - application/not-found-application.interface";
import { IRequest } from "../../interfaces/2 - domain/models/request.interface";
import { IResponse } from "../../interfaces/2 - domain/models/response.interface";
export declare class NotFoundApplication implements INotFoundApplication {
    do(req: IRequest<any>): PromiseLike<IResponse<any>>;
}
