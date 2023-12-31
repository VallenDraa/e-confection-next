import { NewBaju } from '@/schema/baju.schema';
import { NewRekapGaji } from '@/schema/rekap-gaji.schema';
import { Size } from '@prisma/client';
import { findSize } from '../size';

export function createRekapGajiList(
  seriProduksiId: string,
  bajuList: NewBaju[],
  sizesBeforeComma: Size[],
  sizesAfterComma: Size[],
): NewRekapGaji[] {
  if (bajuList.length === 0) {
    return [];
  }

  if (sizesBeforeComma.length === 0 || sizesAfterComma.length === 0) {
    throw new Error('List size tidak boleh kosong.');
  }

  // Grouped baju by karyawan id
  const groupedBaju = bajuList.reduce<Record<string, NewBaju[]>>(
    (acc, baju) => {
      acc[baju.karyawanId] = [...(acc[baju.karyawanId] || []), baju];
      return acc;
    },
    {},
  );

  // Count gaji based on grouped baju
  let rekapGajiList: NewRekapGaji[] = [];

  for (const karyawanId in groupedBaju) {
    if (karyawanId in groupedBaju) {
      const bajuByKaryawan = groupedBaju[karyawanId];

      rekapGajiList = [
        ...rekapGajiList,
        ...countRekapGaji(
          seriProduksiId,
          bajuByKaryawan,
          sizesBeforeComma,
          sizesAfterComma,
        ),
      ];
    }
  }

  return rekapGajiList;
}

function countRekapGaji(
  seriProduksiId: string,
  bajuByKaryawan: NewBaju[],
  sizesBeforeComma: Size[],
  sizesAfterComma: Size[],
) {
  if (bajuByKaryawan.length === 0) {
    throw new Error('List baju tidak boleh kosong.');
  }

  const ONE_DOZEN = 12;

  const bajuListGroupedBySize = bajuByKaryawan.reduce<NewBaju[][]>(
    (acc, baju) => {
      if (acc.length === 0) {
        acc.push([baju]);
      } else {
        for (let i = 0; i < acc.length; i++) {
          const group = acc[i];

          if (group[0].sizeId === baju.sizeId) {
            group.push(baju);
            break;
          } else if (i === acc.length - 1) {
            acc.push([baju]);
          }
        }
      }

      return acc;
    },
    [],
  );

  const rekapGajiKaryawan: NewRekapGaji[] = [];

  for (const groupedBaju of bajuListGroupedBySize) {
    const sizeBeforeComma = findSize(groupedBaju[0].sizeId, sizesBeforeComma);

    if (!sizeBeforeComma || !sizeBeforeComma.afterCommaPairId) {
      throw new Error('Size tidak ditemukan.');
    }

    const sizeAfterComma = findSize(
      sizeBeforeComma?.afterCommaPairId,
      sizesAfterComma,
    );

    if (!sizeAfterComma) {
      throw new Error('Size tidak ditemukan.');
    }

    const frontQty = groupedBaju.reduce(
      (acc, baju) => acc + baju.jumlahDepan,
      0,
    );

    const dozenQuantity = (frontQty / ONE_DOZEN).toFixed(1).toString();
    const [beforeComma, afterComma] = dozenQuantity.split('.');

    const beforeCommaValue = parseInt(beforeComma) * sizeBeforeComma.harga;
    const afterCommaValue = parseInt(afterComma) * sizeAfterComma.harga;

    rekapGajiKaryawan.push({
      id: crypto.randomUUID(),
      seriProduksiId,
      merekId: groupedBaju[0].merekId ?? null,
      jumlahGaji: beforeCommaValue + afterCommaValue,
      sizeId: groupedBaju[0].sizeId,
      karyawanId: groupedBaju[0].karyawanId,
    });
  }

  return rekapGajiKaryawan;
}
