import { NewSeriProduksi } from '@/schema/seri-produksi.schema';

export type BajuFormData = {
  seriProduksi: NewSeriProduksi;
  selectedWarna: string[];
};

export type BajuFormStoreProps = {
  formData: BajuFormData;
  overrideSeriProduksi: (nama: string | null, nomorSeri: number) => void;
  overrideSelectedWarna: (warnaIds: string[]) => void;
  overrideGrupWarnaList: (
    warnaIds: string[],
    seriProduksi: NewSeriProduksi,
  ) => void;
  overrideData: (seriProduksi: NewSeriProduksi) => void;
  resetFormData: () => void;
};
