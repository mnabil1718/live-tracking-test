export interface NewAuthPayload {
  accessToken: string;
  refreshToken: string;
}

export class NewAuth {
  readonly accessToken: string;
  readonly refreshToken: string;

  constructor(payload: NewAuthPayload) {
    this._verifyPayload(payload);

    this.accessToken = payload.accessToken;
    this.refreshToken = payload.refreshToken;
  }

  _verifyPayload(payload: NewAuthPayload) {
    const { accessToken, refreshToken } = payload;

    if (accessToken == null || refreshToken == null) {
      throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
