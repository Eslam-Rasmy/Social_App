import { HttpException } from "./http.exception.utils.js";

export class BadRequestException extends HttpException {
  constructor(message: string, public error?: object) {
    super(message, 400, error);
  }
}

export class ConflictExeption extends HttpException {
  constructor(message: string, public error?: object) {
    super(message, 409, error);
  }
}

export class NotFoundExeption extends HttpException {
  constructor(message: string, public error?: object) {
    super(message, 404, error);
  }
}

export class UnauthorizedExeption extends HttpException {
  constructor(message: string, public error?: object) {
    super(message, 401, error);
  }
}
