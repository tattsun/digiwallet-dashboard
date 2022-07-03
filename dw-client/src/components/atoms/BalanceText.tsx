import React from 'react';
import { Typography } from '@mui/material';
import { Currency } from '../../consts/currencies';

function currencySign(currency: Currency) {
  switch (currency) {
    case 'ETH':
      return 'ETH';
    case 'EUR':
      return '€';
    case 'USD':
      return '＄';
    default:
      return currency;
  }
}

export interface BalanceTextProps {
  currency: Currency;
  value: string;
}
export default function BalanceText(props: BalanceTextProps) {
  return (
    <Typography fontWeight="bold">
      {props.value} {currencySign(props.currency)}
    </Typography>
  );
}
