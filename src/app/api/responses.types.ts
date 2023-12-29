export type GETResponse<T> = {
  data: T;
};

export type GETPaginatedResponse<T> = GETResponse<T> & {
  metadata: {
    prev: number;
    current: number;
    next: number;
    last: number;
  };
};

export type ErrorResponse = {
  message: string;
};
