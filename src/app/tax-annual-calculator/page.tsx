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
import { IResult } from '@/interfaces/sahod-calculator/results';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { getHelpLink } from '@/helpers/sahod-calculator/help-links';
import { RESULT_ATTRIBUTES } from '@/constants/sahod-calculator/results';
import { reducer } from '@/helpers/sahod-calculator/result-reducer';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { AnnualTaxCalculator } from '@/helpers/tax-annual-calculator/annual-tax-calculator';

export default function Page() {
  const {
    ANNUAL_INCOME,
    ANNUAL_BONUSES_AND_ALLOWANCES,
    ANNUAL_SSS,
    ANNUAL_PHILHEALTH,
    ANNUAL_PAG_IBIG,
    ANNUAL_CONTRIBUTIONS,
    ANNUAL_TAXABLE_INCOME,
    ANNUAL_GROSS_INCOME,
    ANNUAL_INCOME_TAX,
    ANNUAL_EFFECTIVE_TAX_RATE,
    ANNUAL_NET_INCOME,
  } = RESULT_ATTRIBUTES;

  const initialResults: IResult[] = [
    { name: ANNUAL_INCOME, value: '', explanation: '-' },
    { name: ANNUAL_BONUSES_AND_ALLOWANCES, value: '', explanation: '-' },
    { name: ANNUAL_SSS, value: '', explanation: '-' },
    { name: ANNUAL_PHILHEALTH, value: '', explanation: '-' },
    { name: ANNUAL_PAG_IBIG, value: '', explanation: '-' },
    { name: ANNUAL_CONTRIBUTIONS, value: '', explanation: '-' },
    { name: ANNUAL_TAXABLE_INCOME, value: '', explanation: '-' },
    { name: ANNUAL_GROSS_INCOME, value: '', explanation: '-' },
    { name: ANNUAL_INCOME_TAX, value: '', explanation: '-' },
    { name: ANNUAL_EFFECTIVE_TAX_RATE, value: '', explanation: '-' },
    { name: ANNUAL_NET_INCOME, value: '', explanation: '-' },
  ];

  const [isReady, setIsReady] = React.useState(false);
  const [isResultShow, setIsResultShow] = React.useState(false);
  const [isCalculating, setIsCalculating] = React.useState(false);

  const [annualIncome, setAnnualIncome] = React.useState(0);
  const [annualBonusesAndAllowances, setAnnualBonusesAndAllowances] =
    React.useState(0);
  const [annualIncomeInput, setAnnualIncomeInput] = React.useState('');
  const [annualBonusesAndAllowancesInput, setAnnualBonusesAndAllowancesInput] =
    React.useState('');

  const [calculatorSnapshot, setCalculatorSnapshot] =
    React.useState<AnnualTaxCalculator | null>(null);
  const [results, setResults] = React.useReducer(reducer, initialResults);

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

  const formatWholeNumber = (digitsOnly: string) => {
    if (!digitsOnly) return '';
    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatUpToTwoDecimals = (rawValue: string) => {
    const cleaned = rawValue.replace(/,/g, '').replace(/[^\d.]/g, '');
    if (!cleaned) return '';

    const firstDotIndex = cleaned.indexOf('.');
    const hasDot = firstDotIndex !== -1;
    const normalized = hasDot
      ? `${cleaned.slice(0, firstDotIndex)}.${cleaned
          .slice(firstDotIndex + 1)
          .replace(/\./g, '')}`
      : cleaned;

    const [intPartRaw = '', decimalRaw = ''] = normalized.split('.');
    const intDigits = intPartRaw.replace(/\D/g, '');
    const intPart = intDigits ? formatWholeNumber(intDigits) : '0';
    const decimalPart = decimalRaw.replace(/\D/g, '').slice(0, 2);

    if (hasDot) {
      return `${intPart}.${decimalPart}`;
    }

    return intPartRaw ? intPart : '';
  };

  const onChangeNumericInput = (
    rawValue: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setNumber: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const formatted = formatUpToTwoDecimals(rawValue);
    const normalized = formatted.replace(/,/g, '');
    setInput(formatted);
    setNumber(normalized && normalized !== '.' ? Number(normalized) : 0);
  };

  const selectAllOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  const selectAllOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const input = e.currentTarget.querySelector('input');
    input?.select();
  };

  const onClickCompute = async () => {
    setIsCalculating(true);
    await sleep(500);

    const calculator = new AnnualTaxCalculator(
      annualIncome,
      annualBonusesAndAllowances
    );

    setCalculatorSnapshot(calculator);
    setResults([
      {
        name: ANNUAL_INCOME,
        value: formatPhpCurrency(annualIncome),
        explanation: calculator.annualIncomeExplanation,
      },
      {
        name: ANNUAL_BONUSES_AND_ALLOWANCES,
        value: formatPhpCurrency(annualBonusesAndAllowances),
        explanation: calculator.annualBonusesAndAllowancesExplanation,
      },
      {
        name: ANNUAL_SSS,
        value: formatPhpCurrency(calculator.annualSss),
        explanation: calculator.annualSssExplanation,
      },
      {
        name: ANNUAL_PHILHEALTH,
        value: formatPhpCurrency(calculator.annualPhilHealth),
        explanation: calculator.annualPhilHealthExplanation,
      },
      {
        name: ANNUAL_PAG_IBIG,
        value: formatPhpCurrency(calculator.annualPagIbig),
        explanation: calculator.annualPagIbigExplanation,
      },
      {
        name: ANNUAL_CONTRIBUTIONS,
        value: formatPhpCurrency(calculator.annualContributions),
        explanation: calculator.annualContributionsExplanation,
      },
      {
        name: ANNUAL_TAXABLE_INCOME,
        value: formatPhpCurrency(calculator.annualTaxableIncome),
        explanation: calculator.annualTaxableIncomeExplanation,
      },
      {
        name: ANNUAL_GROSS_INCOME,
        value: formatPhpCurrency(calculator.annualGrossIncome),
        explanation: calculator.annualGrossIncomeExplanation,
      },
      {
        name: ANNUAL_INCOME_TAX,
        value: formatPhpCurrency(calculator.annualIncomeTax),
        explanation: calculator.annualIncomeTaxExplanation,
      },
      {
        name: ANNUAL_EFFECTIVE_TAX_RATE,
        value: `${calculator.annualEffectiveTaxRate.toFixed(2)}%`,
        explanation: calculator.annualEffectiveTaxRateExplanation,
      },
      {
        name: ANNUAL_NET_INCOME,
        value: formatPhpCurrency(calculator.annualNetIncome),
        explanation: calculator.annualNetIncomeExplanation,
      },
    ]);

    setIsResultShow(true);
    setIsCalculating(false);
  };

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

  React.useEffect(() => {
    let ignore = false;
    initialLoad(setIsReady);
    return () => {
      ignore = true;
    };
  }, []);

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
          Annual Inputs
        </Typography>
        <Typography variant='subtitle1' color='text.secondary'>
          Enter annual income and annual bonuses/allowances. Government
          contributions are computed from annual income.
        </Typography>
        <StackVertical spacing={2}>
          <StackHorizontal spacing={2.5} rotateOnSmall={{ spacing: 2 }}>
          <TextField
            label='Annual Income'
            prefix='₱'
            type='text'
            value={annualIncomeInput}
            inputProps={{ inputMode: 'decimal' }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.common.white, 0.95),
              },
            }}
            onFocus={selectAllOnFocus}
            onClick={selectAllOnClick}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChangeNumericInput(
                e.target.value,
                setAnnualIncomeInput,
                setAnnualIncome
              );
            }}
          />
          <TextField
            label='Annual Bonuses and Allowances'
            prefix='₱'
            type='text'
            value={annualBonusesAndAllowancesInput}
            inputProps={{ inputMode: 'decimal' }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.common.white, 0.95),
              },
            }}
            onFocus={selectAllOnFocus}
            onClick={selectAllOnClick}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChangeNumericInput(
                e.target.value,
                setAnnualBonusesAndAllowancesInput,
                setAnnualBonusesAndAllowances
              );
            }}
          />
          </StackHorizontal>
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
        </StackVertical>
      </StackVertical>
    </Paper>
  );

  const quickStats = calculatorSnapshot && (
    (() => {
      const quickStatCardSx = {
        flex: 1,
        minHeight: 168,
        display: 'flex',
        flexDirection: 'column' as const,
        borderRadius: 3,
        padding: 2,
      };

      const quickStatTitleSx = {
        minHeight: 44,
        lineHeight: 1.25,
        display: 'flex',
        alignItems: 'flex-start',
      };

      const quickStatValueSx = {
        mt: 'auto',
        lineHeight: 1.1,
      };

      return (
    <StackVertical spacing={2}>
      <StackHorizontal spacing={2} rotateOnSmall={{ spacing: 2 }} sx={{ alignItems: 'stretch' }}>
        <Paper
          sx={{
            ...quickStatCardSx,
            backgroundColor: alpha(theme.palette.primary.main, 0.09),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
          }}
        >
          <Typography variant='subtitle1' color='text.secondary' sx={quickStatTitleSx}>
            Annual Gross
          </Typography>
          <Typography variant='h2' sx={{ ...quickStatValueSx, color: theme.palette.primary.main }}>
            {formatPhpCurrency(calculatorSnapshot.annualGrossIncome)}
          </Typography>
        </Paper>
        <Paper
          sx={{
            ...quickStatCardSx,
            backgroundColor: alpha(theme.palette.success.main, 0.09),
            border: `1px solid ${alpha(theme.palette.success.main, 0.22)}`,
          }}
        >
          <Typography variant='subtitle1' color='text.secondary' sx={quickStatTitleSx}>
            Annual Net
          </Typography>
          <Typography variant='h2' sx={{ ...quickStatValueSx, color: theme.palette.success.main }}>
            {formatPhpCurrency(calculatorSnapshot.annualNetIncome)}
          </Typography>
        </Paper>
        <Paper
          sx={{
            ...quickStatCardSx,
            backgroundColor: alpha(theme.palette.success.main, 0.09),
            border: `1px solid ${alpha(theme.palette.success.main, 0.22)}`,
          }}
        >
          <Typography variant='subtitle1' color='text.secondary' sx={quickStatTitleSx}>
            Net Income Ratio (Net/Gross)
          </Typography>
          <Typography variant='h2' sx={{ ...quickStatValueSx, color: theme.palette.success.main }}>
            {calculatorSnapshot.annualNetToGrossRate.toFixed(2)}%
          </Typography>
        </Paper>
      </StackHorizontal>

      <StackHorizontal spacing={2} rotateOnSmall={{ spacing: 2 }} sx={{ alignItems: 'stretch' }}>
        <Paper
          sx={{
            ...quickStatCardSx,
            backgroundColor: alpha(theme.palette.warning.main, 0.09),
            border: `1px solid ${alpha(theme.palette.warning.main, 0.22)}`,
          }}
        >
          <Typography variant='subtitle1' color='text.secondary' sx={quickStatTitleSx}>
            Annual Deductions
          </Typography>
          <Typography variant='h2' sx={{ ...quickStatValueSx, color: theme.palette.warning.main }}>
            {formatPhpCurrency(
              calculatorSnapshot.annualContributions.plus(
                calculatorSnapshot.annualIncomeTax
              )
            )}
          </Typography>
        </Paper>
        <Paper
          sx={{
            ...quickStatCardSx,
            backgroundColor: alpha(theme.palette.warning.main, 0.09),
            border: `1px solid ${alpha(theme.palette.warning.main, 0.22)}`,
          }}
        >
          <Typography variant='subtitle1' color='text.secondary' sx={quickStatTitleSx}>
            Annual Contributions
          </Typography>
          <Typography variant='h2' sx={{ ...quickStatValueSx, color: theme.palette.warning.main }}>
            {formatPhpCurrency(calculatorSnapshot.annualContributions)}
          </Typography>
        </Paper>
        <Paper
          sx={{
            ...quickStatCardSx,
            backgroundColor: alpha(theme.palette.error.main, 0.09),
            border: `1px solid ${alpha(theme.palette.error.main, 0.22)}`,
          }}
        >
          <Typography variant='subtitle1' color='text.secondary' sx={quickStatTitleSx}>
            Annual Tax
          </Typography>
          <Typography variant='h2' sx={{ ...quickStatValueSx, color: theme.palette.error.main }}>
            {formatPhpCurrency(calculatorSnapshot.annualIncomeTax)}
          </Typography>
        </Paper>
        <Paper
          sx={{
            ...quickStatCardSx,
            backgroundColor: alpha(theme.palette.primary.main, 0.09),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
          }}
        >
          <Typography variant='subtitle1' color='text.secondary' sx={quickStatTitleSx}>
            Effective Tax Rate
          </Typography>
          <Typography variant='h2' sx={{ ...quickStatValueSx, color: theme.palette.primary.main }}>
            {calculatorSnapshot.annualEffectiveTaxRate.toFixed(2)}%
          </Typography>
        </Paper>
      </StackHorizontal>
    </StackVertical>
      );
    })()
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
                id: 'group-annual-inputs',
                name: 'Annual Inputs',
                value: '',
                explanation: '',
                isGroup: true,
              },
              {
                id: ANNUAL_INCOME,
                ...resultByName[ANNUAL_INCOME],
              },
              {
                id: ANNUAL_BONUSES_AND_ALLOWANCES,
                ...resultByName[ANNUAL_BONUSES_AND_ALLOWANCES],
              },
              {
                id: 'group-annual-deductions',
                name: 'Annual Contributions',
                value: '',
                explanation: '',
                isGroup: true,
              },
              {
                id: ANNUAL_SSS,
                ...resultByName[ANNUAL_SSS],
              },
              {
                id: ANNUAL_PHILHEALTH,
                ...resultByName[ANNUAL_PHILHEALTH],
              },
              {
                id: ANNUAL_PAG_IBIG,
                ...resultByName[ANNUAL_PAG_IBIG],
              },
              {
                id: ANNUAL_CONTRIBUTIONS,
                ...resultByName[ANNUAL_CONTRIBUTIONS],
              },
              {
                id: 'group-annual-results',
                name: 'Annual Results',
                value: '',
                explanation: '',
                isGroup: true,
              },
              {
                id: ANNUAL_TAXABLE_INCOME,
                ...resultByName[ANNUAL_TAXABLE_INCOME],
              },
              {
                id: ANNUAL_GROSS_INCOME,
                ...resultByName[ANNUAL_GROSS_INCOME],
              },
              {
                id: ANNUAL_INCOME_TAX,
                ...resultByName[ANNUAL_INCOME_TAX],
              },
              {
                id: ANNUAL_EFFECTIVE_TAX_RATE,
                ...resultByName[ANNUAL_EFFECTIVE_TAX_RATE],
              },
              {
                id: ANNUAL_NET_INCOME,
                ...resultByName[ANNUAL_NET_INCOME],
              },
            ];

            return (
              <Paper
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
                  backgroundColor: alpha(theme.palette.common.white, 0.94),
                  padding: 1,
                }}
              >
                <StackVertical spacing={3}>
                  <Typography
                    variant='h4'
                    sx={{ color: theme.palette.text.primary, fontWeight: 700 }}
                  >
                    Annual Tax Breakdown
                  </Typography>
                  <Table
                    autoHeght={true}
                    hideFooter={true}
                    rowCount={detailsRows.length}
                    columns={columns}
                    rows={detailsRows}
                    getRowClassName={({ row }) => {
                      if (row?.isGroup) return 'group-row';
                      return 'regular-row';
                    }}
                    sx={{
                      border: 'none',
                      '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        minHeight: '56px !important',
                        borderBottom: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                      },
                      '& .MuiDataGrid-columnHeader': {
                        py: 1.25,
                      },
                      '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                      },
                      '& .MuiDataGrid-cell': {
                        py: 1.25,
                        px: 1.5,
                        alignItems: 'flex-start',
                        lineHeight: 1.45,
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
                        minHeight: '52px !important',
                        py: 1.5,
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
            Tax Annual Calculator
          </Typography>
          <Typography variant='subtitle1' color='text.secondary'>
            Annual tax summary from taxable and non taxable earnings, including
            deductions, effective tax rate, and annual net. Use this to check overall earning and check if your deductions are correct.
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
