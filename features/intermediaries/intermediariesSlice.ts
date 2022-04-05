import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IIntermediaryService, { Intermediary } from './IIntermediaryService.types';
import fakeIntermediaryService from './FakeIntermediaryService';

export interface IIntermediariesState {
  items: Intermediary[],
  isLoading: boolean,
}

const initialState: IIntermediariesState = {
  items: [],
  isLoading: false,
};

const intermediariesSlice = createSlice({
  name: 'intermediaries',
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setIntermediaries(state, action: PayloadAction<Intermediary[]>) {
      state.items = action.payload;
    },
  },
});

export const {
  setIntermediaries,
  setIsLoading,
} = intermediariesSlice.actions;

const intermediaryService: IIntermediaryService = fakeIntermediaryService;

// TODO figure out how correctly type dispatch function.
// for proper type we need StoreState interface, but it causes cycle dependency: store <=> slices
// @ts-ignore
export const fetchIntermediaries = () => async (dispatch) => {
  dispatch(setIsLoading(true));

  const intermediaries = await intermediaryService.getAll();
  dispatch(setIntermediaries(intermediaries));

  dispatch(setIsLoading(false));
};

// @ts-ignore
export const deleteIntermediary = (id: number) => async (dispatch) => {
  await intermediaryService.delete(id);
  dispatch(fetchIntermediaries());
};

// @ts-ignore
export const addIntermediary = (item: Omit<Intermediary, 'id' | 'createdAt'>) => async (dispatch) => {
  await intermediaryService.add(item);
  dispatch(fetchIntermediaries());
};

export default intermediariesSlice.reducer;
