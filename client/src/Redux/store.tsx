'use client'

import { useRef } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  Provider,
} from "react-redux";
import globalReducer from '@/features/status/statusSlice';
import dataReducer from '@/features/data/dataSlice';
import userReducer from '@/features/user/userSlice';
import { api } from "@/features/api";
import { setupListeners } from "@reduxjs/toolkit/query";

const rootReducer = combineReducers({
  global: globalReducer,
  data : dataReducer,
  user : userReducer,
  [api.reducerPath]: api.reducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefault) =>
      getDefault().concat(api.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }
  return (
    <Provider store={storeRef.current}>
      {children}
    </Provider>
  );
}