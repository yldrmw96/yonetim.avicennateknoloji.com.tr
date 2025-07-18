import { Metadata } from 'next'
import AccountCreateClient from './client'

export const metadata: Metadata = {
  title: 'Hesap Oluştur',
  description: 'Hesap Oluştur',
}

export default function Page() {
  return <AccountCreateClient />;
}
