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

    const rekapGajiList = await prisma.rekapGajiKaryawan.findMany({
      select: { id: true, jumlahGaji: true, createdAt: true },
    });

    const formattedRekapGaji: ChartDataItem[] = rekapGajiList.map(rekap => ({
      id: rekap.id,
      createdAt: rekap.createdAt,
      jumlah: rekap.jumlahGaji,
    }));

    const groupedByMonthly = groupByMonth(formattedRekapGaji);

    return NextResponse.json<ChartDataGETResponse>(
      { data: formatChartData('Rekap Gaji', groupedByMonthly) },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk mengambil data statistik bulanan rekap gaji!' },
      { status: 500 },
    );
  }
}
