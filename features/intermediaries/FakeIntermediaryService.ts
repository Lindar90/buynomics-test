import IIntermediaryService, { Intermediary } from './IIntermediaryService.types';

const LS_INTERMEDIARIES_KEY = 'intermediaries';

const defaultIntermediaries = [
  {
    id: 1,
    name: 'Distributor: US Foods',
    order: 1,
    createdAt: 1648895896000,
  },
  {
    id: 2,
    name: 'Retailer: Whole Foods',
    order: 2,
    createdAt: 1641119896000,
  },
];

const fakeIntermediaryService: IIntermediaryService = {
  getAll() {
    if (localStorage.getItem(LS_INTERMEDIARIES_KEY) === null) {
      localStorage.setItem(LS_INTERMEDIARIES_KEY, JSON.stringify(defaultIntermediaries));
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const items = JSON.parse(localStorage.getItem(LS_INTERMEDIARIES_KEY) || '');
        return resolve(items);
      }, 500);
    });
  },

  delete(id: number) {
    const items: Intermediary[] = JSON.parse(localStorage.getItem(LS_INTERMEDIARIES_KEY) || '[]');

    const itemToDelete = items.find((i) => i.id === id);

    if (!itemToDelete) {
      throw new Error(`Intermediary with ID ${id} not found.`);
    }

    const updatedItems = items.filter((i) => i.id !== id);

    localStorage.setItem(LS_INTERMEDIARIES_KEY, JSON.stringify(updatedItems));

    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  },

  add(item) {
    const items: Intermediary[] = JSON.parse(localStorage.getItem(LS_INTERMEDIARIES_KEY) || '[]');

    const newItem = {
      ...item,
      id: items.length + 1,
      createdAt: Date.now(),
    };

    items.push(newItem);

    localStorage.setItem(LS_INTERMEDIARIES_KEY, JSON.stringify(items));

    return new Promise((resolve) => {
      setTimeout(() => resolve(newItem), 500);
    });
  },

  getById(id: number) {
    const items: Intermediary[] = JSON.parse(localStorage.getItem(LS_INTERMEDIARIES_KEY) || '[]');

    const item = items.find((i) => i.id === id);

    if (!item) {
      throw new Error(`Intermediary with ID ${id} not found.`);
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve(item), 500);
    });
  },

  update(item: Intermediary) {
    const items: Intermediary[] = JSON.parse(localStorage.getItem(LS_INTERMEDIARIES_KEY) || '[]');

    const updatedItems = items.map((i) => (i.id !== item.id ? i : item));

    localStorage.setItem(LS_INTERMEDIARIES_KEY, JSON.stringify(updatedItems));

    return new Promise((resolve) => {
      setTimeout(() => resolve(item), 500);
    });
  },
};

export default fakeIntermediaryService;
