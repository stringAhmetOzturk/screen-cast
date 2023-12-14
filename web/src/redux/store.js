import { configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './authReducer'
import { setupListeners } from '@reduxjs/toolkit/dist/query'

const persistAuthConfig = {
  key: 'auth',
  version: 1,
  storage,
}

const persistedAuthReducer = persistReducer(persistAuthConfig, authReducer)

export const store = configureStore({
  reducer: {

    auth:persistedAuthReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
})
setupListeners(store.dispatch)
export let persistor = persistStore(store)
