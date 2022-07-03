import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { apiClient } from '../../api/ApiClient';
import BalanceText from '../atoms/BalanceText';
import { stringToCurrency, TargetCurrencies } from '../../consts/currencies';
import RateInput from '../atoms/RateInput';

export interface DashboardProps {
  address: string;
  onClickBack: () => unknown;
}

export function Dashboard(props: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [walletIsOld, setWalletIsOld] = useState(false);
  const [targetCurrency, setTargetCurrency] = useState(TargetCurrencies[0]);
  const [rate, setRate] = useState('0');
  const [balance, setBalance] = useState('0');
  const [isEditing, setIsEditing] = useState(false);

  const onChangeCurrency = (e: SelectChangeEvent<string>) => {
    setTargetCurrency(stringToCurrency(e.target.value));
  };

  const refresh = async () => {
    {
      const res = await apiClient.getWalletIsOld(props.address);
      if (res == null) {
        setError('No transactions fonud');
        return;
      }
      setWalletIsOld(res.result);
    }
    {
      const res = await apiClient.getRate('ETH', targetCurrency);
      setRate(res.rate);
    }
    {
      const res = await apiClient.getBalance(props.address, targetCurrency);
      setBalance(res.balance);
    }
  };

  useEffect(() => {
    const f = async () => {
      setLoading(true);
      try {
        await refresh();
      } catch {
        setError('Some error has occured');
      } finally {
        setLoading(false);
      }
    };
    void f();
  }, [props.address, targetCurrency]);

  const onClickEdit = () => {
    setIsEditing(true);
  };

  const onClickCancel = () => {
    setIsEditing(false);
  };

  const onClickSave = async (newRate: string) => {
    setLoading(true);
    try {
      await apiClient.putRate('ETH', targetCurrency, newRate);
      setIsEditing(false);
      await refresh();
    } catch {
      setError('Some error has occured');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <h2>Dashboard: {props.address}</h2>

        {loading && (
          <Box textAlign="center">
            <CircularProgress />
          </Box>
        )}
        {error && <Box>{error}</Box>}
        {!loading && !error && (
          <>
            {walletIsOld && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Wallet is old!
              </Alert>
            )}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Card sx={{ mr: 2 }}>
                <CardContent>
                  {!isEditing && (
                    <Box>
                      <Box textAlign="right">
                        <EditIcon color="primary" onClick={onClickEdit} />
                      </Box>
                      <Typography fontWeight="bold">{rate}</Typography>
                    </Box>
                  )}
                  {isEditing && (
                    <RateInput initialValue={rate} onClickCancel={onClickCancel} onClickSave={onClickSave} />
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Box sx={{ mb: 1 }}>
                    <Select
                      variant="standard"
                      value={targetCurrency}
                      onChange={onChangeCurrency}
                      sx={{ width: '100px' }}
                      disabled={isEditing}
                    >
                      {TargetCurrencies.map((currency) => (
                        <MenuItem key={currency} value={currency}>
                          {currency}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <Box>
                    <BalanceText value={balance} currency={targetCurrency} />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </>
        )}

        <Button variant="contained" color="info" onClick={props.onClickBack} sx={{ mt: 2 }}>
          Back
        </Button>
      </CardContent>
    </Card>
  );
}
