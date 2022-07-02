import React, { useState } from 'react';
import { AddressInput } from '../components/organisms/AddressInput';
import { Dashboard } from '../components/organisms/Dashboard';

export default function DashboardPage() {
  const [address, setAddress] = useState<string>('');

  return (
    <>
      {address.length === 0 && <AddressInput onSubmit={setAddress} />}
      {address.length > 0 && <Dashboard address={address} />}
    </>
  );
}
