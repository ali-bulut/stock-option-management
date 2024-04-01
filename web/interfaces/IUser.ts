export interface IUser {
  id: number;
  name: string;
  email: string;
  stripe_customer_id: string;
  balance_in_cents: number;
}

export interface IUserWithToken extends IUser {
  token: string;
}
