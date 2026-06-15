

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';
import { store, persistor } from './redux/store';
import AppRoutes from './routes/AppRoutes';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CartProvider>
          <Toaster position="top-right" />
          <AppRoutes />
        </CartProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
