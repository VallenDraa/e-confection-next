import * as React from 'react';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TableFooter,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Baju, Merek, Size } from '@prisma/client';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { grey } from '@mui/material/colors';
import { NewBaju } from '@/schema/baju.schema';
import { PreviewKaryawan } from '@/schema/karyawan.schema';
import { NewRekapGaji } from '@/schema/rekap-gaji.schema';
import { rupiah } from '@/lib/formatter';

type BajuTableProps = {
  grupWarnaBajuId: string;
  canDelete?: boolean;
  merekList: Merek[];
  sizeList: Size[];
  bajuList: NewBaju[];
  rekapGajiKaryawan: NewRekapGaji[];
  previewKaryawanList: PreviewKaryawan[];
  onBajuDelete?: (id: string) => void;
};

type BajuColumnIds = keyof NewBaju | 'hapus' | 'no';

type BajuColumn = {
  id: BajuColumnIds;
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
    grupWarnaBajuId,
    bajuList,
    canDelete,
    onBajuDelete,
    merekList,
    sizeList,
    rekapGajiKaryawan,
    previewKaryawanList,
  } = props;

  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof NewBaju>('merekId');

  function handleSort(
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    property: keyof NewBaju,
  ) {
    setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    setOrderBy(property);
  }

  const getRowValue = React.useCallback(
    (baju: NewBaju, columnKey: keyof NewBaju) => {
      let value;

      switch (true) {
        case columnKey === 'merekId':
          value =
            merekList.find(merek => merek.id === baju.merekId)?.nama ?? 'N/A';
          break;

        case columnKey === 'sizeId':
          value = sizeList.find(size => size.id === baju.sizeId)?.nama ?? 'N/A';
          break;

        case columnKey === 'karyawanId':
          value =
            previewKaryawanList.find(
              karyawan => karyawan.id === baju.karyawanId,
            )?.nama ?? 'N/A';
          break;

        default:
          value = baju[columnKey];
          break;
      }

      return value;
    },
    [merekList, previewKaryawanList, sizeList],
  );

  const sortedBajuList = React.useMemo(() => {
    return bajuList.sort((a, b) => {
      const valueA = getRowValue(a, orderBy);
      const valueB = getRowValue(b, orderBy);

      if (valueA < valueB) {
        return order === 'desc' ? -1 : 1;
      } else if (valueA > valueB) {
        return order === 'desc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }, [getRowValue, bajuList, orderBy, order]);

  return (
    <TableContainer
      sx={{ backgroundColor: grey[200], maxHeight: 320, width: '100%' }}
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
                  {column.id === 'no' || column.id === 'hapus' ? (
                    column.label
                  ) : (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={e => handleSort(e, column.id as keyof NewBaju)}
                    >
                      {column.label}
                    </TableSortLabel>
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedBajuList.map((baju, i) => {
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
                    const value =
                      column.id === 'no' ? i + 1 : getRowValue(baju, column.id);

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
          <TableRow>
            <TableCell sx={{ fontSize: '16px !important' }} colSpan={4}>
              Total Harga:
            </TableCell>
            <TableCell
              sx={{ fontSize: '16px !important' }}
              align="center"
              colSpan={2}
            >
              {rupiah(
                rekapGajiKaryawan.reduce(
                  (acc, rekap) =>
                    rekap.grupWarnaBajuId === grupWarnaBajuId
                      ? acc + rekap.jumlahGaji
                      : acc,
                  0,
                ),
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
