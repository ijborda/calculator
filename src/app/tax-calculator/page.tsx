'use client';

import {
  LoadingButton,
  Paper,
  SecondaryTitle,
  Skeleton,
  StackHorizontal,
  StackVertical,
  TextField,
  Table,
  Link,
} from '@/components';
import { computeTax } from '@/helpers/tax-calculator/calculator';
import { reducer } from '@/helpers/tax-calculator/reducer';
import { initialLoad, sleep } from '@/helpers/utility';
import theme from '@/theme';
import { formatPhpCurrency } from '@/utils/currency';
import React from 'react';
import { IResult } from '../interface/tax-calculator/results';
import { RESULT_ATTRIBUTES } from '@/constants/tax-calculator/attributes';

/**
 * Head Page
 */
export default function Page() {
  /**
   * Declarations
   */
  const { INCOME_TAX, TAXABLE_INCOME, NET_PAY } = RESULT_ATTRIBUTES;
  const initialResults: IResult[] = [
    {
      name: TAXABLE_INCOME,
      value: '',
      explanation: '-',
    },
    {
      name: INCOME_TAX,
      value: '',
      explanation: '-',
    },
    {
      name: NET_PAY,
      value: '',
      explanation: '-',
    },
  ];

  /**
   * States
   */
  const [isReady, setIsReady] = React.useState(false);
  const [isResultShow, setIsResultShow] = React.useState(false);
  const [isCalculating, setIsCalculating] = React.useState(false);

  const [annualTaxableIncome, setAnnualTaxableIncome] = React.useState(0);
  const [results, setResults] = React.useReducer(reducer, initialResults);

  /**
   * Side effects
   */
  React.useEffect(() => {
    let ignore = false;
    initialLoad(setIsReady);
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
          <LoadingButton
            loading={isCalculating}
            onClick={async () => {
              setIsCalculating(true);
              await sleep(500);
              const { tax, netPay, explanation } =
                computeTax(annualTaxableIncome);

              setResults([
                {
                  name: INCOME_TAX,
                  value: formatPhpCurrency(tax),
                  explanation: explanation,
                },
                { name: NET_PAY, value: formatPhpCurrency(netPay) },
                {
                  name: TAXABLE_INCOME,
                  value: formatPhpCurrency(annualTaxableIncome),
                },
              ]);

              setIsResultShow(true);
              setIsCalculating(false);
            }}
          >
            Calculate
          </LoadingButton>
          {isResultShow &&
            (isCalculating ? (
              <Skeleton color={theme.palette.background.default} rowCount={1} />
            ) : (
              <Table
                autoHeght={true}
                hideFooter={true}
                rowCount={12}
                columns={[
                  {
                    field: 'entity',
                    headerName: 'Results',
                    flex: 0.25,
                  },
                  { field: 'value', headerName: 'Value', flex: 0.25 },
                  {
                    field: 'explanation',
                    headerName: 'Explanation',
                    flex: 0.5,
                    renderCell: (params) => (
                      <StackVertical spacing={1}>
                        {(params.row.explanation as string)
                          ?.split('<br/>')
                          .map((a) => (
                            <div>{a}</div>
                          ))}
                        {params.row.entity === 'Income Tax' && (
                          <Link href='https://www.bir.gov.ph/income-tax'>
                            More info: BIR Tax Rate (scroll down to INCOME TAX
                            RATES)
                          </Link>
                        )}
                      </StackVertical>
                    ),
                  },
                ]}
                rows={results.map((result) => ({
                  id: result.name,
                  entity: result.name,
                  value: result.value,
                  explanation: result.explanation,
                }))}
              />
            ))}
        </StackVertical>
      </Paper>
    </StackVertical>
  );

  return <>{isReady ? mainComp : <Skeleton />}</>;
}
