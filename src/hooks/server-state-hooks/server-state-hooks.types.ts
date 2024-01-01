export type ServerStateHookCallbackType = 'query' | 'add' | 'edit' | 'delete';

export type ServerStateHookCallback = {
  onSuccess?: (type: ServerStateHookCallbackType) => void;
  onError?: (type: ServerStateHookCallbackType) => void;
};
