export type OmitDBMetadata<T extends any> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt'
>;
