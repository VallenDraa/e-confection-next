import * as React from 'react';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Merek, Size } from '@prisma/client';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { grey } from '@mui/material/colors';
import { NewBaju } from '@/schema/baju.schema';
import { PreviewKaryawan } from '@/schema/karyawan.schema';

type BajuTableProps = {
  canDelete?: boolean;
  merekList: Merek[];
  sizeList: Size[];
  bajuList: NewBaju[];
  previewKaryawanList: PreviewKaryawan[];
  onBajuDelete?: (id: string) => void;
};

type BajuColumn = {
  id: keyof NewBaju | 'hapus' | 'no';
  label:
    | 'No'
    | 'Merek'
    | 'Size'
    | 'J.Depan'
    | 'J.Belakang'
    | 'Pekerja'
    | 'Hapus';
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
    id: 'karyawanId',
    label: 'Pekerja',
    minWidth: 50,
    align: 'center',
    format: (value: number) => value.toLocaleString('id-ID'),
  },
  {
    id: 'jumlahDepan',
    label: 'J.Depan',
    minWidth: 50,
    align: 'center',
    format: (value: number) => value.toLocaleString('id-ID'),
  },
  {
    id: 'jumlahBelakang',
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
  const {
    bajuList,
    canDelete,
    onBajuDelete,
    merekList,
    sizeList,
    previewKaryawanList,
  } = props;

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
            {columns.map(column => {
              if (!canDelete && column.id === 'hapus') {
                return null;
              }

              return (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {bajuList.map((baju, i) => {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                {columns.map(column => {
                  if (!canDelete && column.id === 'hapus') {
                    return null;
                  }

                  if (column.id === 'hapus') {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <ConfirmDeleteDialog
                          onDelete={() => onBajuDelete?.(baju.id)}
                        >
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

                    switch (true) {
                      case column.id === 'merekId':
                        value =
                          merekList.find(merek => merek.id === baju.merekId)
                            ?.nama ?? 'N/A';
                        break;

                      case column.id === 'sizeId':
                        value =
                          sizeList.find(size => size.id === baju.sizeId)
                            ?.nama ?? 'N/A';
                        break;

                      case column.id === 'karyawanId':
                        value =
                          previewKaryawanList.find(
                            karyawan => karyawan.id === baju.karyawanId,
                          )?.nama ?? 'N/A';
                        break;

                      case column.id === 'no':
                        value = i + 1;
                        break;

                      default:
                        value = baju[column.id];
                        break;
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

        <TableFooter>
          <TableRow>
            <TableCell sx={{ fontSize: '16px !important' }} colSpan={4}>
              Total Jumlah:
            </TableCell>
            {columns.map(column => {
              if (!canDelete && column.id === 'hapus') {
                return null;
              }

              if (
                column.id === 'jumlahDepan' ||
                column.id === 'jumlahBelakang'
              ) {
                return (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sx={{ fontSize: '16px !important' }}
                  >
                    {bajuList.reduce(
                      (acc, baju) =>
                        acc +
                        baju[column.id as 'jumlahBelakang' | 'jumlahDepan'],
                      0,
                    )}
                  </TableCell>
                );
              }

              return null;
            })}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
