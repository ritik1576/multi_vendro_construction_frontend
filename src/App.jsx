

import { Provider } from 'react-redux';
import store from './redux/store';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Provider store={store}>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </Provider>
  )
}

export default App
