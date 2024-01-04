import { clientUnauthedApiResponse } from '@/lib/auth/user-auth-checker';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { KaryawanGETResponse } from '../karyawan-route.types';

export async function GET(req: NextRequest) {
  try {
    await clientUnauthedApiResponse();

    const page = Number(req.nextUrl.searchParams.get('page') || 1);
    const search = req.nextUrl.searchParams.get('search') || '';
    const size = Number(req.nextUrl.searchParams.get('size') || 6);

    const totalData = await prisma.karyawan.count({
      where: {
        softDelete: { not: null },
      },
    });
    const totalPages = Math.ceil(totalData / size) || 1;

    const karyawanData = await prisma.karyawan.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        nama: { contains: search },
        telepon: { contains: search },
        softDelete: { not: null },
      },
      skip: (page - 1) * size,
      take: size,
    });

    return NextResponse.json<KaryawanGETResponse>(
      {
        data: karyawanData,
        metadata: {
          prev: page > 1 ? page - 1 : 1,
          current: page,
          next: page < totalPages ? page + 1 : totalPages,
          last: totalPages,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk mengambil data karyawan yang sudah terhapus!' },
      { status: 500 },
    );
  }
}
