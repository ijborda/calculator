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
  TextFieldSelect,
} from '@/components';
import { initialLoad, sleep } from '@/helpers/utility';
import theme from '@/theme';
import { formatPhpCurrency } from '@/utils/currency';
import React from 'react';
import { IResult } from '../../interfaces/sahod-calculator/results';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { getHelpLink } from '@/helpers/sahod-calculator/help-links';
import { TaxCalculator } from '@/helpers/sahod-calculator/tax-calculator';
import { RESULT_ATTRIBUTES } from '@/constants/sahod-calculator/results';
import { reducer } from '@/helpers/sahod-calculator/result-reducer';
import {
  PAYROLL_PERIOD,
  payrollPeriodOptions,
} from '@/constants/sahod-calculator/payroll-period';

export default function Page() {
  /**
   * Constants
   */
  const { ANNUAL_INCOME_TAX, ANNUAL_TAXABLE_INCOME, ANNUAL_NET_INCOME } =
    RESULT_ATTRIBUTES;
  const { ANNUAL } = PAYROLL_PERIOD;

  /**
   * Data
   */
  const initialResults: IResult[] = [
    {
      name: ANNUAL_TAXABLE_INCOME,
      value: '',
      explanation: '-',
    },
    {
      name: ANNUAL_INCOME_TAX,
      value: '',
      explanation: '-',
    },
    {
      name: ANNUAL_NET_INCOME,
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
  const [payrollPeriod, setPayrollPeriod] = React.useState(ANNUAL);
  const [results, setResults] = React.useReducer(reducer, initialResults);

  /**
   * Functions
   */
  const getExplanationComponent = (explanation?: string) => {
    return explanation
      ?.split('<br/>')
      .map((paragraph, i) => <div key={i}>{paragraph}</div>);
  };

  const getHelpComponent = (attribute: RESULT_ATTRIBUTES) => {
    const helpLink = getHelpLink(attribute);
    if (!helpLink) return;
    return <Link href={helpLink.link}>{helpLink.displayText}</Link>;
  };

  const renderExplanationComponent = ({
    row,
  }: GridRenderCellParams<IResult>) => {
    const { explanation, name } = row;
    return (
      <StackVertical spacing={1}>
        {getExplanationComponent(explanation)}
        {getHelpComponent(name)}
      </StackVertical>
    );
  };

  const onClickCompute = async () => {
    // Start calculation
    setIsCalculating(true);
    await sleep(500);
    // Compute and set results
    const taxCalculator = new TaxCalculator(annualTaxableIncome, payrollPeriod);
    setResults([
      {
        name: ANNUAL_TAXABLE_INCOME,
        value: formatPhpCurrency(taxCalculator.annualTaxableIncome),
        explanation: taxCalculator.annualTaxableIncomeExplanation,
      },
      {
        name: ANNUAL_INCOME_TAX,
        value: formatPhpCurrency(taxCalculator.annualIncomeTax),
        explanation: taxCalculator.annualIncomeTaxExplanation,
      },
      {
        name: ANNUAL_NET_INCOME,
        value: formatPhpCurrency(taxCalculator.annualNetIncome),
        explanation: taxCalculator.annualNetIncomeExplanation,
      },
    ]);
    // Wrapup computation
    setIsResultShow(true);
    setIsCalculating(false);
  };

  /**
   * Declarations
   */
  const columns = [
    {
      field: 'name',
      headerName: 'Results',
      flex: 0.25,
    },
    { field: 'value', headerName: 'Value', flex: 0.25 },
    {
      field: 'explanation',
      headerName: 'Explanation',
      flex: 0.5,
      renderCell: renderExplanationComponent,
    },
  ];

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
   * Components
   */
  const input = (
    <>
      <StackHorizontal spacing={3}>
        <TextFieldSelect
          label='Payroll Period'
          value={payrollPeriod}
          options={payrollPeriodOptions}
          onChange={(e) => {
            setPayrollPeriod(e.target.value as unknown as PAYROLL_PERIOD);
          }}
        ></TextFieldSelect>
        <TextField
          label='Taxable Income for the Period'
          prefix='₱'
          value={annualTaxableIncome}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const val = Number(e.target.value);
            if (val) setAnnualTaxableIncome(val);
          }}
        ></TextField>
      </StackHorizontal>
      <LoadingButton loading={isCalculating} onClick={onClickCompute}>
        Calculate
      </LoadingButton>
    </>
  );

  const output = (
    <>
      {isResultShow &&
        (isCalculating ? (
          <Skeleton color={theme.palette.background.default} rowCount={1} />
        ) : (
          <Table
            autoHeght={true}
            hideFooter={true}
            rowCount={12}
            columns={columns}
            rows={results.map((result) => ({
              key: result.name,
              id: result.name,
              name: result.name,
              value: result.value,
              explanation: result.explanation,
            }))}
          />
        ))}
    </>
  );

  const mainComp = (
    <StackVertical horizontalSpacing='stretch' spacing={3}>
      <Paper>
        <StackVertical horizontalSpacing='center' spacing={5}>
          <SecondaryTitle title='Sahod Calculator' />
          {input}
          {output}
        </StackVertical>
      </Paper>
    </StackVertical>
  );

  return <>{isReady ? mainComp : <Skeleton />}</>;
}
