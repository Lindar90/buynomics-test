import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import intermediariesReducer from '../features/intermediaries/intermediariesSlice';

const store = configureStore({
  reducer: {
    intermediaries: intermediariesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>;

export default store;
