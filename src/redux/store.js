import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import authReducer from './authReducer';
import productReducer from './productReducer';
import categoryReducer from './categoryReducer';
import cartReducer from './cartReducer';
import orderReducer from './orderReducer';
import adminReducer from './adminReducer';
import addressReducer from './addressReducer';
import vendorReducer from './vendorReducer';
import rootSaga from '../saga/rootSaga';

// Create a foolproof storage wrapper to fix Vite CJS interop issues with redux-persist
const customStorage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, item) => Promise.resolve(localStorage.setItem(key, item)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};

const authPersistConfig = {
  key: 'auth',
  storage: customStorage,
  whitelist: ['user', 'token', 'isAuthenticated'], // Never persist isLoading or errors
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  product: productReducer,
  category: categoryReducer,
  cart: cartReducer,
  order: orderReducer,
  admin: adminReducer,
  address: addressReducer,
  vendor: vendorReducer,
});

const rootPersistConfig = {
  key: 'root',
  storage: customStorage,
  whitelist: [], // Auth is handled individually above
};

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);
