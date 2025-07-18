import { Metadata } from 'next'
import ForgotPassword from './client'

export const metadata: Metadata = {
  title: 'Şifremi Unuttum',
  description: 'Şifremi Unuttum',
}

export default function Page() {
  return <ForgotPassword />;
}