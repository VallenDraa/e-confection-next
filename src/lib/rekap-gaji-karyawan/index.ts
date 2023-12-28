import { NewBaju } from '@/schema/baju.schema';
import { NewRekapGaji } from '@/schema/rekap-gaji.schema';
import { Baju, Size } from '@prisma/client';

export function createRekapGaji(
  karyawanId: string,
  grupWarnaBajuId: string,
  bajuList: NewBaju[],
  sizeList: Size[],
): NewRekapGaji {
  return {
    id: crypto.randomUUID(),
    grupWarnaBajuId,
    karyawanId,
    jumlahGaji: countGajiKaryawan(bajuList, sizeList),
  };
}

export function countGajiKaryawan(
  bajuList: Baju[] | NewBaju[],
  sizeList: Size[],
) {
  if (bajuList.length === 0) {
    return 0;
  }

  if (sizeList.length === 0) {
    throw new Error('List size tidak boleh kosong.');
  }

  return bajuList.reduce((acc, baju) => {
    const sizePrize = sizeList.find(size => size.id === baju.sizeId)?.harga;

    if (sizePrize === undefined) {
      throw new Error('Size tidak ditemukan.');
    }

    return acc + sizePrize;
  }, 0);
}
