export enum IntermediaryType {
  RANGE = 'Range',
  DROPDOWN = 'Dropdown',
}

export interface Intermediary {
  id: number,
  name: string,
  order: number,
  createdAt: number,
  type: IntermediaryType,
  from?: number,
  to?: number,
  step?: number,
  options: { option: string, value: number }[],
}

export default interface IIntermediaryService {
  getAll: () => Promise<Intermediary[]>,
  delete: (id: number) => Promise<void>,
  add: (item: Omit<Intermediary, 'id' | 'createdAt'>) => Promise<Intermediary>,
  getById: (id: number) => Promise<Intermediary>,
  update: (item: Intermediary) => Promise<Intermediary>;
}
