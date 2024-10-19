import { Metadata } from 'next';
import { redirect } from 'next/navigation';

/**
 * Head Metadata
 */
export const metadata: Metadata = {
  title: 'Tools',
};

/**
 * Page
 */
export default async function Page() {
  redirect('/tools/tax-calculator');
}
