import { prisma } from '../prisma';

export async function createRekapGajiKaryawan(
  newData: Array<{
    jumlahGaji: bigint;
    grupWarnaBajuId: string;
    karyawanId: string;
  }>,
) {
  const newRekapGajiKaryawan = await prisma.$transaction(
    newData.map(rekapGaji =>
      prisma.rekapGajiKaryawan.create({
        data: {
          jumlahGaji: rekapGaji.jumlahGaji,
          grupWarnaBajuId: rekapGaji.grupWarnaBajuId,
          karyawanId: rekapGaji.karyawanId,
        },
      }),
    ),
  );

  return newRekapGajiKaryawan;
}

export async function editRekapGajiKaryawan(
  updatedData: Array<{
    id: string;
    jumlahGaji?: bigint;
    grupWarnaBajuId?: string;
    karyawanId?: string;
  }>,
) {
  await prisma.rekapGajiKaryawan.updateMany({
    where: { id: { in: updatedData.map(rekapGaji => rekapGaji.id) } },
    data: updatedData.map(rekapGaji => ({
      jumlahGaji: rekapGaji.jumlahGaji,
      grupWarnaBajuId: rekapGaji.grupWarnaBajuId,
      karyawanId: rekapGaji.karyawanId,
    })),
  });
}
