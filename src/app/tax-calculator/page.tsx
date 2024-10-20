'use client';

import {
  Button,
  Paper,
  SecondaryTitle,
  Skeleton,
  StackHorizontal,
  StackVertical,
  TextField,
  Table,
} from '@/components';
import { computeTax } from '@/helpers/tax-calculator';
import { formatPhpCurrency } from '@/utils/currency';
import { logger } from '@/utils/logger';
import React, { EventHandler } from 'react';

/**
 * Head Page
 */
export default function Page() {
  /**
   * Declarations
   */

  /**
   * States
   */
  const [isReady, setIsReady] = React.useState(false);
  const [annualTaxableIncome, setAnnualTaxableIncome] = React.useState(0);
  const [taxableIncome, setTaxableIncome] = React.useState('');
  const [incomeTax, setIncomeTax] = React.useState('');
  const [netPay, setNetPay] = React.useState('');

  /**
   * Functions
   */

  /**
   * Side effects
   */
  React.useEffect(() => {
    // Fetch announcements
    const fn = async () => {
      await logger.call(async () => {
        if (ignore) return;
        setIsReady(true);
      });
    };
    let ignore = false;
    fn();
    return () => {
      ignore = true;
    };
  }, []);

  /**
   * Component
   */
  const mainComp = (
    <StackVertical horizontalSpacing='stretch' spacing={3}>
      <Paper>
        <StackVertical horizontalSpacing='center' spacing={5}>
          <SecondaryTitle title='Tax Calculator' />
          <StackHorizontal>
            <TextField
              label='Annual Taxable Income'
              prefix='₱'
              value={annualTaxableIncome}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = Number(e.target.value);
                if (val) {
                  setAnnualTaxableIncome(val);
                }
              }}
            ></TextField>
          </StackHorizontal>
          <Button
            onClick={() => {
              const { tax, netPay } = computeTax(annualTaxableIncome);
              setTaxableIncome(formatPhpCurrency(annualTaxableIncome));
              setIncomeTax(formatPhpCurrency(tax));
              setNetPay(formatPhpCurrency(netPay));
            }}
          >
            Calculate
          </Button>
          <Table
            hideFooter={true}
            rowCount={12}
            columns={[
              { field: 'entity', headerName: 'Results', flex: 1 },
              { field: 'value', headerName: '', flex: 1 },
            ]}
            rows={[
              {
                id: 0,
                entity: 'Total Taxable Income',
                value: taxableIncome,
              },
              {
                id: 1,
                entity: 'Income Tax',
                value: incomeTax,
              },
              {
                id: 2,
                entity: 'Net Pay',
                value: netPay,
              },
            ]}
          />
        </StackVertical>
      </Paper>
    </StackVertical>
  );

  return <>{isReady ? mainComp : <Skeleton />}</>;
}
