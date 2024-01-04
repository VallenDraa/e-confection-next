import { clientUnauthedApiResponse } from '@/lib/auth/user-auth-checker';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import {
  ChartDataGETResponse,
  ChartDataItem,
} from '../../chart-produksi.types';
import { formatChartData, groupByMonth } from '@/lib/api/chart-data-formatter';

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

    const groupByMonthly = groupByMonth(formattedSeriProduksi);

    return NextResponse.json<ChartDataGETResponse>(
      { data: formatChartData('Produksi', groupByMonthly) },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk mengambil data statistik bulanan produksi!' },
      { status: 500 },
    );
  }
}
