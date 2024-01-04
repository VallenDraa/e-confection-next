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

    const rekapGajiList = await prisma.rekapGajiKaryawan.findMany({
      select: { id: true, jumlahGaji: true, createdAt: true },
    });

    const formattedRekapGaji: ChartDataItem[] = rekapGajiList.map(rekap => ({
      id: rekap.id,
      createdAt: rekap.createdAt,
      jumlah: rekap.jumlahGaji,
    }));

    const groupedByYearly = groupByYear(formattedRekapGaji);

    return NextResponse.json<ChartDataGETResponse>(
      { data: formatChartData('Rekap Gaji', groupedByYearly) },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk mengambil data statistik tahunan rekap gaji!' },
      { status: 500 },
    );
  }
}
