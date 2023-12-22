import { prisma } from '../prisma';

export async function createManyBaju(
  newData: Array<{
    jumlahDepan: number;
    jumlahBelakang: number;
    sizeId: string;
    grupWarnaBajuId: string;
    merekId?: string;
  }>,
) {
  const newBajuList = await prisma.$transaction(
    newData.map(baju =>
      prisma.baju.create({
        data: {
          jumlahDepan: baju.jumlahDepan,
          jumlahBelakang: baju.jumlahBelakang,
          sizeId: baju.sizeId,
          grupWarnaBajuId: baju.grupWarnaBajuId,
          merekId: baju.merekId,
        },
      }),
    ),
  );

  return newBajuList;
}

export async function editManyBaju(
  updatedData: Array<{
    id: string;
    jumlahDepan?: number;
    jumlahBelakang?: number;
    sizeId?: string;
    grupWarnaBajuId?: string;
    merekId?: string | null;
  }>,
) {
  await prisma.baju.updateMany({
    where: { id: { in: updatedData.map(baju => baju.id) } },
    data: updatedData.map(baju => ({
      jumlahDepan: baju.jumlahDepan,
      jumlahBelakang: baju.jumlahBelakang,
      sizeId: baju.sizeId,
      grupWarnaBajuId: baju.grupWarnaBajuId,
      merekId: baju.merekId,
    })),
  });
}
