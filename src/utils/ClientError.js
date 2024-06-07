export class ClientError extends Error {
<<<<<<< HEAD
    httpStatus;
    service;
    details;
    code;
  
    constructor(service, code, httpStatus, message, details) {
      super(message);
      this.httpStatus = httpStatus;
      this.service = service;
      this.details = details;
      this.code = code;
    }
  }
=======
  httpStatus;
  service;
  message;
  details;
  code;

  constructor(service, code, httpStatus, message, details) {
    super(message);
    this.httpStatus = httpStatus;
    this.service = service;
    this.details = details;
    this.code = code;
  }
}
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176
