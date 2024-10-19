import { Metadata } from 'next';
import { redirect } from 'next/navigation';

/**
 * Head Metadata
 */
export const metadata: Metadata = {
  title: 'Tax Calculator',
};

export default async function Page() {
  redirect('/tax-calculator');
}
