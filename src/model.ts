import { Identifier } from './identifier';

export const CurrentModelVersion = 1;

export const isEmptyListOfIds = (ids: (Identifier | undefined)[]) => ids.filter((n) => n !== undefined).length === 0;

export interface RedirectResponse<T> {
  response?: T;
}

export interface RedirectRequest<T> {
  request: T;
  returnUrl: string;
}

export interface PAFNode {
  hostName: string;
  privateKey: string;
}
