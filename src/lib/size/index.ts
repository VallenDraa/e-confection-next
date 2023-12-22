import { prisma } from '../prisma';

export async function createSizes(
  newData: Array<{ size: string; price: number }>,
) {
  const newSizes = await prisma.$transaction(
    newData.map(size =>
      prisma.size.create({ data: { nama: size.size, harga: size.price } }),
    ),
  );

  return newSizes;
}

export async function editSizes(
  updatedData: Array<{ id: string; nama: string; price: number }>,
) {
  await prisma.size.updateMany({
    where: { id: { in: updatedData.map(size => size.id) } },
    data: updatedData.map(size => ({ nama: size.nama, harga: size.price })),
  });
}
