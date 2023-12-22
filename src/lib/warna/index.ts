import { prisma } from '../prisma';

export async function createManyWarna(
  newData: Array<{ nama: string; hexColor: string }>,
) {
  const warnaList = await prisma.$transaction(
    newData.map(data =>
      prisma.warna.create({
        data: { nama: data.nama, kodeWarna: data.hexColor },
      }),
    ),
  );

  return warnaList;
}

export async function editManyWarna(
  updatedData: Array<{ id: string; nama: string; hexColor: string }>,
) {
  await prisma.warna.updateMany({
    where: { id: { in: updatedData.map(warna => warna.id) } },
    data: updatedData.map(warna => ({
      nama: warna.nama,
      kodeWarna: warna.hexColor,
    })),
  });
}
