import * as React from 'react';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { NewBaju } from '..';
import { Merek, Size } from '@prisma/client';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { grey } from '@mui/material/colors';

type BajuTableProps = {
  merekList: Merek[];
  sizeList: Size[];
  bajuList: NewBaju[];
  onBajuDelete(index: number): void;
};

type BajuColumn = {
  id: keyof NewBaju | 'hapus' | 'no';
  label: 'No' | 'Merek' | 'Size' | 'J.Depan' | 'J.Belakang' | 'Hapus';
  minWidth?: number;
  align?: 'center';
  format?: (value: number) => string;
};

const columns: BajuColumn[] = [
  {
    id: 'no',
    label: 'No',
    minWidth: 30,
    align: 'center',
    format: (value: number) => value.toLocaleString('id-ID'),
  },
  {
    id: 'merekId',
    label: 'Merek',
    minWidth: 50,
    align: 'center',
    format: (value: number) => value.toLocaleString('id-ID'),
  },
  {
    id: 'sizeId',
    label: 'Size',
    minWidth: 50,
    align: 'center',
    format: (value: number) => value.toLocaleString('id-ID'),
  },
  {
    id: 'jmlDepan',
    label: 'J.Depan',
    minWidth: 50,
    align: 'center',
    format: (value: number) => value.toLocaleString('id-ID'),
  },
  {
    id: 'jmlBelakang',
    label: 'J.Belakang',
    minWidth: 50,
    align: 'center',
    format: (value: number) => value.toLocaleString('id-ID'),
  },
  {
    id: 'hapus',
    label: 'Hapus',
    minWidth: 50,
    align: 'center',
    format: (value: number) => value.toLocaleString('id-ID'),
  },
];

export function BajuTable(props: BajuTableProps) {
  const { bajuList, onBajuDelete, merekList, sizeList } = props;

  return (
    <TableContainer
      sx={{
        backgroundColor: grey[200],
        maxHeight: 320,
        width: '100%',
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {bajuList.map((baju, i) => {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                {columns.map(column => {
                  if (column.id === 'hapus') {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <ConfirmDeleteDialog onDelete={() => onBajuDelete(i)}>
                          {setOpen => {
                            return (
                              <IconButton
                                color="error"
                                size="medium"
                                onClick={() => setOpen(true)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            );
                          }}
                        </ConfirmDeleteDialog>
                      </TableCell>
                    );
                  } else {
                    let value;

                    if (column.id === 'merekId') {
                      value =
                        merekList.find(merek => merek.id === baju.merekId)
                          ?.nama ?? 'N/A';
                    } else if (column.id === 'sizeId') {
                      value =
                        sizeList.find(size => size.id === baju.sizeId)?.nama ??
                        'N/A';
                    } else if (column.id === 'no') {
                      value = i + 1;
                    } else {
                      value = baju[column.id];
                    }

                    return (
                      <TableCell
                        sx={{ fontSize: '14px', fontWeight: 700 }}
                        key={column.id}
                        align={column.align}
                      >
                        {column.format && typeof value === 'number'
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
