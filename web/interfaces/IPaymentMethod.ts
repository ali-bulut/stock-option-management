export interface IPaymentMethod {
  id: string;
  card: ICard;
}

interface ICard {
  brand: string;
  exp_month: number;
  exp_year: number;
  last4: string;
}
