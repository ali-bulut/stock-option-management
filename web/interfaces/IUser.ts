export interface IUser {
  name: string;
  email: string;
}

export interface IUserWithToken extends IUser {
  token: string;
}
