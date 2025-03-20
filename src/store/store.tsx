import { configureStore } from "@reduxjs/toolkit";
import { catsApi } from "../services/catsService";
import authReducer from "./slices/authSlice";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

export type RootState = {
	cats: ReturnType<typeof catsApi.reducer>;
	auth: ReturnType<typeof authReducer>;
};

const store = configureStore({
	reducer: {
		cats: catsApi.reducer,
		auth: authReducer,
		[catsApi.reducerPath]: catsApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(catsApi.middleware),
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store };