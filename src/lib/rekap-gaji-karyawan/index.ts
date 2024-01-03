import { NewBaju } from '@/schema/baju.schema';
import { NewRekapGaji } from '@/schema/rekap-gaji.schema';
import { Size } from '@prisma/client';
import { findSizeById } from '../size';

type RekapGajiListResult = {
  bajuRekapGajiList: Map<string, string>;
  rekapGajiList: NewRekapGaji[];
};

export function createRekapGajiList(
  seriProduksiId: string,
  bajuList: NewBaju[],
  sizesBeforeComma: Size[],
  sizesAfterComma: Size[],
): RekapGajiListResult {
  if (bajuList.length === 0) {
    return {
      bajuRekapGajiList: new Map(),
      rekapGajiList: [],
    };
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
  // and get rekap gaji id for each baju
  const returnValue: RekapGajiListResult = {
    bajuRekapGajiList: new Map(),
    rekapGajiList: [],
  };

  for (const karyawanId in groupedBaju) {
    if (karyawanId in groupedBaju) {
      const bajuByKaryawan = groupedBaju[karyawanId];

      const rekapGajiResults = countRekapGaji(
        seriProduksiId,
        bajuByKaryawan,
        sizesBeforeComma,
        sizesAfterComma,
      );

      for (const { bajuIds, ...others } of rekapGajiResults) {
        returnValue.rekapGajiList.push(others);

        for (const bajuId of bajuIds) {
          returnValue.bajuRekapGajiList.set(bajuId, others.id);
        }
      }
    }
  }

  return returnValue;
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

  const bajuListGroupedBySizeAndWarna = bajuByKaryawan.reduce<NewBaju[][]>(
    (acc, baju) => {
      if (acc.length === 0) {
        acc.push([baju]);
      } else {
        for (let i = 0; i < acc.length; i++) {
          const group = acc[i];

          if (
            group[0].sizeId === baju.sizeId &&
            group[0].grupWarnaBajuId === baju.grupWarnaBajuId
          ) {
            if (group.every(pushedBaju => pushedBaju.id !== baju.id)) {
              group.push(baju);
            }
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

  const rekapGajiKaryawan: Array<NewRekapGaji & { bajuIds: string[] }> = [];

  for (const groupedBaju of bajuListGroupedBySizeAndWarna) {
    const sizeBeforeComma = findSizeById(
      groupedBaju[0].sizeId,
      sizesBeforeComma,
    );

    if (!sizeBeforeComma || !sizeBeforeComma.afterCommaPairId) {
      throw new Error('Size tidak ditemukan.');
    }

    const sizeAfterComma = findSizeById(
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
      bajuIds: groupedBaju.map(b => b.id),
      grupWarnaBajuId: groupedBaju[0].grupWarnaBajuId,
      jumlahGaji: beforeCommaValue + afterCommaValue,
      sizeId: groupedBaju[0].sizeId,
      karyawanId: groupedBaju[0].karyawanId,
    });
  }

  return rekapGajiKaryawan;
}
