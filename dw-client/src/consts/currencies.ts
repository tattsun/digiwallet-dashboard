/* eslint-disable import/prefer-default-export */

export const Currencies = ['ETH', 'EUR', 'USD', 'Unknown'] as const;
export const TargetCurrencies = Currencies.filter((cur) => !['ETH', 'Unknown'].includes(cur));
type CurrenciesTuple = typeof Currencies;
export type Currency = CurrenciesTuple[number];

export function stringToCurrency(str: string): Currency {
  if ((Currencies as readonly string[]).includes(str)) {
    return str as Currency;
  }
  return 'Unknown';
}
