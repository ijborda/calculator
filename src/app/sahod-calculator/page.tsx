'use client';

import {
  LoadingButton,
  Paper,
  Skeleton,
  StackHorizontal,
  StackVertical,
  TextField,
  Table,
  Link,
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
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

export default function Page() {
  /**
   * Constants
   */
  const {
    MONTHLY_BASIC_INCOME,
    MONTHLY_SSS,
    MONTHLY_PHILHEALTH,
    MONTHLY_PAG_IBIG,
    MONTHLY_DEDUCTIONS,
    MONTHLY_TAXABLE_INCOME,
    MONTHLY_INCOME_TAX,
    MONTHLY_TAKE_HOME_PAY,
    ANNUAL_GROSS_INCOME,
    ANNUAL_DEDUCTIONS,
    ANNUAL_TAXABLE_INCOME,
    ANNUAL_INCOME_TAX,
    ANNUAL_NET_INCOME,
  } = RESULT_ATTRIBUTES;

  /**
   * Data
   */
  const initialResults: IResult[] = [
    {
      name: MONTHLY_BASIC_INCOME,
      value: '',
      explanation: '-',
    },
    {
      name: MONTHLY_SSS,
      value: '',
      explanation: '-',
    },
    {
      name: MONTHLY_PHILHEALTH,
      value: '',
      explanation: '-',
    },
    {
      name: MONTHLY_PAG_IBIG,
      value: '',
      explanation: '-',
    },
    {
      name: MONTHLY_DEDUCTIONS,
      value: '',
      explanation: '-',
    },
    {
      name: MONTHLY_TAXABLE_INCOME,
      value: '',
      explanation: '-',
    },
    {
      name: MONTHLY_INCOME_TAX,
      value: '',
      explanation: '-',
    },
    {
      name: MONTHLY_TAKE_HOME_PAY,
      value: '',
      explanation: '-',
    },
    {
      name: ANNUAL_GROSS_INCOME,
      value: '',
      explanation: '-',
    },
    {
      name: ANNUAL_DEDUCTIONS,
      value: '',
      explanation: '-',
    },
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

  const [monthlyBasicIncome, setMonthlyBasicIncome] = React.useState(0);
  const [calculatorSnapshot, setCalculatorSnapshot] =
    React.useState<TaxCalculator | null>(null);
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
  }: GridRenderCellParams<any>) => {
    if (row?.isGroup) return null;
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
    const taxCalculator = new TaxCalculator(monthlyBasicIncome);
    setCalculatorSnapshot(taxCalculator);
    setResults([
      {
        name: MONTHLY_BASIC_INCOME,
        value: formatPhpCurrency(monthlyBasicIncome),
      },
      {
        name: MONTHLY_SSS,
        value: formatPhpCurrency(taxCalculator.monthlySss),
        explanation: taxCalculator.monthlySssExplanation,
      },
      {
        name: MONTHLY_PHILHEALTH,
        value: formatPhpCurrency(taxCalculator.monthlyPhilHealth),
        explanation: taxCalculator.monthlyPhilHealthExplanation,
      },
      {
        name: MONTHLY_PAG_IBIG,
        value: formatPhpCurrency(taxCalculator.monthlyPagIbig),
        explanation: taxCalculator.monthlyPagIbigExplanation,
      },
      {
        name: MONTHLY_DEDUCTIONS,
        value: formatPhpCurrency(taxCalculator.monthlyDeductions),
        explanation: taxCalculator.monthlyDeductionsExplanation,
      },
      {
        name: MONTHLY_TAXABLE_INCOME,
        value: formatPhpCurrency(taxCalculator.monthlyTaxableIncome),
        explanation: taxCalculator.monthlyTaxableIncomeExplanation,
      },
      {
        name: MONTHLY_INCOME_TAX,
        value: formatPhpCurrency(taxCalculator.monthlyIncomeTax),
        explanation: taxCalculator.monthlyIncomeTaxExplanation,
      },
      {
        name: MONTHLY_TAKE_HOME_PAY,
        value: formatPhpCurrency(taxCalculator.monthlyTakeHomePay),
        explanation: taxCalculator.monthlyTakeHomePayExplanation,
      },
      {
        name: ANNUAL_GROSS_INCOME,
        value: formatPhpCurrency(taxCalculator.annualGrossIncome),
        explanation: taxCalculator.annualGrossIncomeExplanation,
      },
      {
        name: ANNUAL_DEDUCTIONS,
        value: formatPhpCurrency(taxCalculator.annualDeductions),
        explanation: taxCalculator.annualDeductionsExplanation,
      },
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
      headerName: 'Details',
      flex: 0.25,
      renderCell: ({ row }: GridRenderCellParams<any>) => {
        if (row?.isGroup) {
          return (
            <Typography
              variant='subtitle1'
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {row.name}
            </Typography>
          );
        }
        return row.name;
      },
    },
    {
      field: 'value',
      headerName: 'Value',
      flex: 0.25,
      renderCell: ({ row }: GridRenderCellParams<any>) => {
        if (row?.isGroup) return '';
        return row.value;
      },
    },
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
    <Paper
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
        backgroundColor: alpha(theme.palette.common.white, 0.92),
      }}
    >
      <StackVertical spacing={2.5}>
        <Typography
          variant='h4'
          sx={{ color: theme.palette.text.primary, fontWeight: 700 }}
        >
          Monthly Input
        </Typography>
        <Typography variant='subtitle1' color='text.secondary'>
          Enter your gross monthly basic income to estimate deductions and take
          home pay.
        </Typography>
        <StackHorizontal spacing={3} rotateOnSmall={{ spacing: 2 }}>
        <TextField
          label='Monthly Basic Income'
          prefix='₱'
          type='number'
          value={monthlyBasicIncome}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.common.white, 0.95),
            },
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const val = Number(e.target.value);
            setMonthlyBasicIncome(Number.isNaN(val) ? 0 : val);
          }}
        ></TextField>
        <LoadingButton
          loading={isCalculating}
          onClick={onClickCompute}
          sx={{
            minWidth: 190,
            borderRadius: 2,
            fontWeight: 700,
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
        >
          Calculate
        </LoadingButton>
      </StackHorizontal>
      </StackVertical>
    </Paper>
  );

  const quickStats = calculatorSnapshot && (
    <StackHorizontal spacing={2} rotateOnSmall={{ spacing: 2 }}>
      <Paper
        sx={{
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.success.main, 0.09),
          border: `1px solid ${alpha(theme.palette.success.main, 0.22)}`,
          padding: 2,
        }}
      >
        <Typography variant='subtitle1' color='text.secondary'>
          Monthly Take Home
        </Typography>
        <Typography variant='h2' sx={{ color: theme.palette.success.main }}>
          {formatPhpCurrency(calculatorSnapshot.monthlyTakeHomePay)}
        </Typography>
      </Paper>
      <Paper
        sx={{
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.warning.main, 0.09),
          border: `1px solid ${alpha(theme.palette.warning.main, 0.22)}`,
          padding: 2,
        }}
      >
        <Typography variant='subtitle1' color='text.secondary'>
          Monthly Deductions
        </Typography>
        <Typography variant='h2' sx={{ color: theme.palette.warning.main }}>
          {formatPhpCurrency(calculatorSnapshot.monthlyDeductions)}
        </Typography>
      </Paper>
      <Paper
        sx={{
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.primary.main, 0.09),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
          padding: 2,
        }}
      >
        <Typography variant='subtitle1' color='text.secondary'>
          Monthly Tax
        </Typography>
        <Typography variant='h2' sx={{ color: theme.palette.primary.main }}>
          {formatPhpCurrency(calculatorSnapshot.monthlyIncomeTax)}
        </Typography>
      </Paper>
    </StackHorizontal>
  );

  const output = (
    <>
      {isResultShow &&
        (isCalculating ? (
          <Skeleton color={theme.palette.background.default} rowCount={1} />
        ) : (
          (() => {
            const resultByName = results.reduce(
              (acc, curr) => ({ ...acc, [curr.name]: curr }),
              {} as Record<RESULT_ATTRIBUTES, IResult>
            );

            const detailsRows = [
              {
                id: 'group-monthly-breakdown',
                name: 'Monthly Breakdown',
                value: '',
                explanation: '',
                isGroup: true,
              },
              {
                id: MONTHLY_BASIC_INCOME,
                ...resultByName[MONTHLY_BASIC_INCOME],
              },
              {
                id: MONTHLY_SSS,
                ...resultByName[MONTHLY_SSS],
              },
              {
                id: MONTHLY_PHILHEALTH,
                ...resultByName[MONTHLY_PHILHEALTH],
              },
              {
                id: MONTHLY_PAG_IBIG,
                ...resultByName[MONTHLY_PAG_IBIG],
              },
              {
                id: MONTHLY_DEDUCTIONS,
                ...resultByName[MONTHLY_DEDUCTIONS],
              },
              {
                id: MONTHLY_TAXABLE_INCOME,
                ...resultByName[MONTHLY_TAXABLE_INCOME],
              },
              {
                id: 'group-annual-breakdown',
                name: 'Annual Breakdown',
                value: '',
                explanation: '',
                isGroup: true,
              },
              {
                id: ANNUAL_GROSS_INCOME,
                ...resultByName[ANNUAL_GROSS_INCOME],
              },
              {
                id: ANNUAL_DEDUCTIONS,
                ...resultByName[ANNUAL_DEDUCTIONS],
              },
              {
                id: ANNUAL_TAXABLE_INCOME,
                ...resultByName[ANNUAL_TAXABLE_INCOME],
              },
              {
                id: ANNUAL_INCOME_TAX,
                ...resultByName[ANNUAL_INCOME_TAX],
              },
              {
                id: ANNUAL_NET_INCOME,
                ...resultByName[ANNUAL_NET_INCOME],
              },
              {
                id: 'group-monthly-summary',
                name: 'Monthly Summary',
                value: '',
                explanation: '',
                isGroup: true,
              },
              {
                id: 'summary-monthly-deductions',
                name: 'Monthly Deductions',
                value: resultByName[MONTHLY_DEDUCTIONS].value,
                explanation: resultByName[MONTHLY_DEDUCTIONS].explanation,
              },
              {
                id: MONTHLY_INCOME_TAX,
                ...resultByName[MONTHLY_INCOME_TAX],
              },
              {
                id: MONTHLY_TAKE_HOME_PAY,
                ...resultByName[MONTHLY_TAKE_HOME_PAY],
              },
            ];

            return (
          <Paper
            sx={{
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
              backgroundColor: alpha(theme.palette.common.white, 0.94),
            }}
          >
            <StackVertical spacing={2}>
              <Typography
                variant='h4'
                sx={{ color: theme.palette.text.primary, fontWeight: 700 }}
              >
                Salary Breakdown
              </Typography>
              <Table
                autoHeght={true}
                hideFooter={true}
                rowCount={detailsRows.length}
                columns={columns}
                rows={detailsRows}
                getRowClassName={({ row }) => {
                  if (row?.isGroup) return 'group-row';
                  if (String(row?.id).startsWith('summary-')) return 'summary-row';
                  return 'regular-row';
                }}
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    borderBottom: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: `1px solid ${alpha(
                      theme.palette.text.secondary,
                      0.12
                    )}`,
                    color: theme.palette.text.primary,
                  },
                  '& .MuiDataGrid-row': {
                    transition: 'background-color 160ms ease',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.06),
                  },
                  '& .MuiDataGrid-row.group-row': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.07),
                  },
                  '& .MuiDataGrid-row.group-row .MuiDataGrid-cell': {
                    borderBottom: 'none',
                    borderTop: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.25
                    )}`,
                    minHeight: '44px !important',
                  },
                  '& .MuiDataGrid-row.summary-row': {
                    backgroundColor: alpha(theme.palette.success.main, 0.06),
                  },
                  '& .MuiDataGrid-row.summary-row .MuiDataGrid-cell': {
                    fontWeight: 600,
                  },
                  '& .MuiDataGrid-row.regular-row:nth-of-type(even)': {
                    backgroundColor: alpha(theme.palette.common.white, 0.55),
                  },
                }}
              />
            </StackVertical>
          </Paper>
            );
          })()
        ))}
    </>
  );

  const mainComp = (
    <StackVertical
      horizontalSpacing='stretch'
      spacing={3}
      sx={{
        maxWidth: 1100,
        margin: '0 auto',
      }}
    >
      <Paper
        sx={{
          borderRadius: 4,
          background: `linear-gradient(120deg, ${alpha(
            theme.palette.primary.main,
            0.2
          )}, ${alpha(theme.palette.background.default, 0.98)})`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
        }}
      >
        <StackVertical horizontalSpacing='start' spacing={2}>
          <Typography
            variant='h1'
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            Sahod Calculator
          </Typography>
          <Typography variant='subtitle1' color='text.secondary'>
            Modern monthly and annual payroll view with SSS, PhilHealth,
            Pag-IBIG, taxable income, and income tax breakdown.
          </Typography>
          <Box
            sx={{
              height: 4,
              width: 120,
              borderRadius: 999,
              backgroundColor: theme.palette.primary.main,
            }}
          />
        </StackVertical>
      </Paper>
      <StackVertical spacing={2.5}>
          {input}
          {quickStats}
          {output}
      </StackVertical>
    </StackVertical>
  );

  return <>{isReady ? mainComp : <Skeleton />}</>;
}
