export interface UserLoginPayload {
  username: string;
  password: string;
}

export class UserLogin {
  readonly username: string;
  readonly password: string;

  constructor(payload: UserLoginPayload) {
    this._verifyPayload(payload);

    this.username = payload.username;
    this.password = payload.password;
  }

  _verifyPayload(payload: UserLoginPayload) {
    const { username, password } = payload;

    if (username == null || password == null) {
      throw new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
