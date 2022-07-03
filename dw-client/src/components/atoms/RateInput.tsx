/* eslint-disable @typescript-eslint/no-misused-promises */

import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Box, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface FormInput {
  rate: string;
}

export interface RateInputProps {
  initialValue: string;
  onClickCancel: () => unknown;
  onClickSave: (rate: string) => unknown;
}

export default function RateInput(props: RateInputProps) {
  const schema = yup.object({
    rate: yup.string().matches(/^([1-9]\d*|0)(\.\d+)?$/, 'Rate must be a positive number'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      rate: props.initialValue,
    },
    mode: 'onBlur',
  });

  const onClickSave = (data: FormInput) => {
    props.onClickSave(data.rate);
  };

  return (
    <Box>
      <Box textAlign="right">
        <CloseIcon color="error" onClick={props.onClickCancel} />
        <CheckIcon color="success" onClick={handleSubmit(onClickSave)} />
      </Box>
      <TextField fullWidth {...register('rate')} required error={'rate' in errors} helperText={errors.rate?.message} />
    </Box>
  );
}
