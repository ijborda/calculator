import { Metadata } from 'next';
import { redirect } from 'next/navigation';

/**
 * Head Metadata
 */
export const metadata: Metadata = {
  title: 'Sahod Calculator',
};

export default async function Page() {
  redirect('/sahod-calculator');
}
