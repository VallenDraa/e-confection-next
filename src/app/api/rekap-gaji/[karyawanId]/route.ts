import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { prisma } from '@/lib/prisma';
import {
  RekapGajiGETResponse,
  RekapGajiKaryawanGETData,
} from '../rekap-gaji-route.types';

export async function GET(
  req: NextRequest,
  { params }: { params: { karyawanId: string } },
) {
  try {
    const { karyawanId } = params;

    const parseResult = await z.string().safeParseAsync(karyawanId);

    if (!parseResult.success) {
      return NextResponse.json(
        { message: 'Data body yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    const { data: parsedKaryawanId } = parseResult;

    const page = Number(req.nextUrl.searchParams.get('page') ?? 1);
    const size = Number(req.nextUrl.searchParams.get('size') ?? 6);

    const totalData = await prisma.rekapGajiKaryawan.count({
      where: { karyawanId: parsedKaryawanId },
    });
    const totalPages = Math.ceil(totalData / size) || 1;

    const rekapGajiList = await prisma.rekapGajiKaryawan.findMany({
      where: { karyawanId: parsedKaryawanId },
      include: {
        merek: { select: { nama: true } },
        size: { select: { nama: true } },
        seriProduksi: {
          select: {
            nomorSeri: true,
            grupWarnaBaju: {
              select: {
                seriProduksiId: true,
                warna: { select: { nama: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * size,
      take: size,
    });

    const data: RekapGajiKaryawanGETData[] = rekapGajiList.map(rekap => {
      const grupWarna = rekap.seriProduksi.grupWarnaBaju.find(
        grup => grup.seriProduksiId === rekap.seriProduksiId,
      );

      if (!grupWarna) {
        throw new Error();
      }

      return {
        id: rekap.id,
        createdAt: rekap.createdAt,
        jumlahGaji: rekap.jumlahGaji,
        karyawanId: rekap.karyawanId,
        noSeriProduksi: rekap.seriProduksi.nomorSeri,
        seriProduksiId: rekap.seriProduksiId,
        sizeId: rekap.sizeId,
        merekId: rekap.merekId,
        merek: rekap.merek?.nama ?? null,
        size: rekap.size.nama,
        updatedAt: rekap.updatedAt,
        warna: grupWarna.warna.nama,
      };
    });

    return NextResponse.json<RekapGajiGETResponse>(
      {
        data,
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
      { message: 'Gagal untuk memuat data rekap gaji!' },
      { status: 500 },
    );
  }
}
