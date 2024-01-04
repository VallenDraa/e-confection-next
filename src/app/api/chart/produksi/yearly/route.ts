import { clientUnauthedApiResponse } from '@/lib/auth/user-auth-checker';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import {
  ChartDataGETResponse,
  ChartDataItem,
} from '../../chart-produksi.types';
import { formatChartData, groupByYear } from '@/lib/api/chart-data-formatter';

export async function GET() {
  try {
    await clientUnauthedApiResponse();

    const seriProduksiList = await prisma.seriProduksi.findMany({
      select: {
        id: true,
        grupWarnaBaju: { select: { baju: { select: { id: true } } } },
        createdAt: true,
      },
    });

    const formattedSeriProduksi: ChartDataItem[] = seriProduksiList.map(
      seri => {
        return {
          id: seri.id,
          createdAt: seri.createdAt,
          jumlah: seri.grupWarnaBaju.reduce(
            (acc, grup) => acc + grup.baju.length,
            0,
          ),
        };
      },
    );

    const groupByYearly = groupByYear(formattedSeriProduksi);

    return NextResponse.json<ChartDataGETResponse>(
      { data: formatChartData('Produksi', groupByYearly) },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk mengambil data statistik mingguan produksi!' },
      { status: 500 },
    );
  }
}
