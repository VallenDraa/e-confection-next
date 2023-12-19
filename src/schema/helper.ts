type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type OptionalDBMetadata<
  T extends {
    id: string;
    createdAt: Date;
    updatedAt: Date;
  },
> = Optional<T, 'id' | 'createdAt' | 'updatedAt'>;
