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
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import validator from 'validator';
import { apiClient } from '../../api/ApiClient';
import BalanceText from '../atoms/BalanceText';
import { stringToCurrency, TargetCurrencies } from '../../consts/currencies';

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
  const [editingRate, setEditingRate] = useState('0');

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

  const onChangeRate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditingRate(e.target.value);
  };

  const onClickEdit = () => {
    setEditingRate(rate);
    setIsEditing(true);
  };

  const onClickCancel = () => {
    setIsEditing(false);
  };

  const onClickSave = async () => {
    setLoading(true);
    try {
      if (!validator.isNumeric(editingRate)) {
        // eslint-disable-next-line no-alert
        alert('Please input the rate as number');
        return;
      }
      await apiClient.putRate('ETH', targetCurrency, editingRate);
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
                    <Box>
                      <Box textAlign="right">
                        <CloseIcon color="error" onClick={onClickCancel} />
                        <CheckIcon
                          color="success"
                          onClick={() => {
                            void onClickSave();
                          }}
                        />
                      </Box>
                      <TextField fullWidth value={editingRate} onChange={onChangeRate} />
                    </Box>
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
