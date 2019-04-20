import { IRequest, IRequestBodyless } from "../2 - domain/models/request.interface";
import { IResponse } from "../2 - domain/models/response.interface";
import { Request } from "express";

export interface ICommand<TRequestBody, TResponse> {
    do(req: IRequest<TRequestBody>): PromiseLike<IResponse<TResponse>>;
}

export interface ICommandBodyless<TResponse> {
    do (req: IRequestBodyless): PromiseLike<IResponse<TResponse>>
}