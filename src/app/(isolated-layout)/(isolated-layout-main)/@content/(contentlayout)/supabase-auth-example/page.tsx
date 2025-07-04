import { Metadata } from 'next'
import SupabaseAuthExample from './client/index'

export const metadata: Metadata = {
  title: 'Supabase Auth Örneği',
  description: 'Supabase auth işlemleri için örnek sayfa',
}

export default function SupabaseAuthExamplePage() {
  // Client-side auth kontrolü - daha basit approach
  return <SupabaseAuthExample />
} 