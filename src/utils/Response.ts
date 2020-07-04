export enum Status {
  OK = 'OK',
  ERROR = 'ERROR',
}

const CODES = new Map([
  [Status.OK, 200],
  [Status.ERROR, 500],
]);

export default class Response {
  public body: Object;

  constructor(
    public status: Status,
    public data?: Object | null,
    public message?: string,
    public error?: Error,
    public code?: number,
  ) {
    const body = {
      status,
      code: CODES.get(status),
    };
    data && Object.assign(body, { data });
    message && Object.assign(body, { message });
    error && Object.assign(body, { error: error.message });
    code && Object.assign(body, { code });
    this.body = body;
  }
}
