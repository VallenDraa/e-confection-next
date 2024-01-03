import { NewGrupWarna } from '@/schema/grup-warna.schema';
import { NewSeriProduksi } from '@/schema/seri-produksi.schema';
import { create } from 'zustand';
import { BajuFormData, BajuFormStoreProps } from './baju-form-store.types';

export const getDefaultSeriProduksi = (): NewSeriProduksi => ({
  id: crypto.randomUUID(),
  nama: null,
  nomorSeri: 0,
  grupWarnaList: [],
  bajuList: [],
  rekapGajiList: [],
});

export const createNewGrupWarnaList = (
  warnaIds: string[],
  seriProduksi: NewSeriProduksi,
): NewGrupWarna[] => {
  const grupWarnaList = warnaIds.map(warnaId => {
    const existingGrup = seriProduksi.grupWarnaList.find(
      grup => grup.warnaId === warnaId,
    );

    return (
      existingGrup ?? {
        id: crypto.randomUUID(),
        seriProduksiId: seriProduksi.id,
        warnaId,
        karyawanId: '',
      }
    );
  });

  return grupWarnaList;
};

export const useBajuFormStore = create<BajuFormStoreProps>(set => ({
  formData: { seriProduksi: getDefaultSeriProduksi(), selectedWarna: [] },
  overrideData: (seriProduksi: NewSeriProduksi) =>
    set((state): { formData: BajuFormData } => ({
      formData: { ...state.formData, seriProduksi },
    })),
  resetFormData: () => {
    const formData = {
      seriProduksi: getDefaultSeriProduksi(),
      selectedWarna: [],
    };

    set((): { formData: BajuFormData } => ({ formData }));
  },
  overrideSelectedWarna: (warnaIds: string[]) =>
    set(state => ({
      formData: { ...state.formData, selectedWarna: warnaIds },
    })),
  overrideGrupWarnaList(warnaIds: string[], seriProduksi: NewSeriProduksi) {
    set(state => ({
      formData: {
        selectedWarna: warnaIds,
        seriProduksi: {
          ...state.formData.seriProduksi,
          grupWarnaList: createNewGrupWarnaList(warnaIds, seriProduksi),
        },
      },
    }));
  },
  overrideSeriProduksi(nama, nomorSeri) {
    set(state => ({
      formData: {
        ...state.formData,
        seriProduksi: { ...state.formData.seriProduksi, nama, nomorSeri },
      },
    }));
  },
}));
