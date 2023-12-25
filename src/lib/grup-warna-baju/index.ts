import { prisma } from '../prisma';

export async function createManyGrupWarnaBaju(
  data: Array<{
    seriProduksiId: string;
    warnaId: string;
    karyawanId: string;
  }>,
) {
  const grupBajuList = await prisma.$transaction(
    data.map(data => prisma.grupWarnaBaju.create({ data })),
  );

  return grupBajuList;
}
