export const Currencies = ['ETH', 'EUR', 'USD'] as const;
type CurrenciesTuple = typeof Currencies;
export type Currency = CurrenciesTuple[number];

export function isCurrency(str: string): boolean {
  return (Currencies as unknown as Array<string>).includes(str);
}
