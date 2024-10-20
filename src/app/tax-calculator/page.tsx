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
import { GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid';
import { getHelpLink } from '@/helpers/tax-calculator/help-links';

/**
 * Head Page
 */
export default function Page() {
  /**
   * Data
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
   * Functions
   */
  const getExplanationComponent = (explanation?: string) => {
    return explanation
      ?.split('<br/>')
      .map((paragraph) => <div>{paragraph}</div>);
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
    const { tax, netPay, explanation } = computeTax(annualTaxableIncome);
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
      <StackHorizontal>
        <TextField
          label='Annual Taxable Income'
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
          <SecondaryTitle title='Tax Calculator' />
          {input}
          {output}
        </StackVertical>
      </Paper>
    </StackVertical>
  );

  return <>{isReady ? mainComp : <Skeleton />}</>;
}
