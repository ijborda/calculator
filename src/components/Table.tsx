import React, { type ReactElement } from 'react';
import { Box } from '@mui/material';
import { DataGrid, DataGridProps, GridColDef } from '@mui/x-data-grid';

interface Props {
  className?: string;
  columns: GridColDef[];
  rows: any[];
  checkboxSelection?: boolean;
  onRowSelectionModelChange?: Pick<DataGridProps, 'onRowSelectionModelChange'>;
  columnVisibility?: Record<string, boolean>;
  autoHeght?: boolean;
  rowEditable?: boolean;
  processRowUpdate?: ((newRow: any, oldRow: any) => any) | undefined;
  hidePagination?: boolean;
  hideHeader?: boolean;
}

export default function Component(props: Props & DataGridProps): ReactElement {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'table',
        tableLayout: 'fixed',
      }}
    >
      <DataGrid
        rows={props.rows}
        columns={props.columns}
        autoHeight
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
          columns: {
            columnVisibilityModel: props.columnVisibility,
          },
        }}
        slots={
          props.hideHeader
            ? {
                columnHeaders: () => null,
              }
            : undefined
        }
        hideFooter={props.hideFooter}
        paginationMode='server'
        rowCount={props.rowCount}
        pageSizeOptions={[10]}
        // checkboxSelection={props.checkboxSelection ?? true}
        // onRowSelectionModelChange={props.onRowSelectionModelChange ?? undefined}
        onPaginationModelChange={props.onPaginationModelChange}
        getRowHeight={props.autoHeght ? () => 'auto' : undefined}
        getRowClassName={props.getRowClassName}
        editMode={props.rowEditable ? 'row' : undefined}
        processRowUpdate={props.processRowUpdate}
        apiRef={props.apiRef}
        sx={props.sx}
      />
    </Box>
  );
}
