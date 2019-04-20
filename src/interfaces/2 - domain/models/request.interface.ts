import { Request } from "express";

export interface IRequest<TRequestBody> extends IRequestBodyless {
    data: TRequestBody
}

export interface IRequestBodyless extends Request {
}