import { Box, Button, Card, TextField } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import React, { useState } from 'react';

export interface AddressInputProps {
  onSubmit: (_address: string) => unknown;
}
export function AddressInput(props: AddressInputProps) {
  const [address, setAddress] = useState<string>('');

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddress(e.target.value);
  };

  const onClickSubmit = () => {
    props.onSubmit(address);
    setAddress('');
  };

  return (
    <Card>
      <CardContent>
        <h2>Please input your address</h2>
        <Box sx={{ mb: 2 }}>
          <TextField placeholder="your address" fullWidth onChange={onChangeText} />
        </Box>
        <Box>
          <Button variant="contained" onClick={onClickSubmit}>
            Submit
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
