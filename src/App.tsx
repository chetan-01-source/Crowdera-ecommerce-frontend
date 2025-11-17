import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Home from './components/EcommerceComponents/Home';
import CartRoute from './components/CartRoute';
import PaymentSuccess from './components/PaymentSuccess';

import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import { useTokenRefresh } from './hooks/useTokenRefresh';

// Component to initialize token refresh monitoring
const TokenRefreshWrapper = ({ children }: { children: React.ReactNode }) => {
  useTokenRefresh(300); // Refresh when token has 5 minutes left
  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <TokenRefreshWrapper>
          <div className="App">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/Home" element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              } />
              <Route path="/cart" element={
                <PrivateRoute>
                  <CartRoute />
                </PrivateRoute>
              } />
              <Route path="/success" element={
                <PrivateRoute>
                  <PaymentSuccess />
                </PrivateRoute>
              } />
           
              <Route path="/dashboard" element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              } />
            </Routes>
          </div>
        </TokenRefreshWrapper>
      </Router>
    </Provider>
  );
}

export default App;
