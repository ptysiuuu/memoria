import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';

import RootLayout from './pages/Root';
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';
import ErrorPage from './pages/ErrorPage';
import WelcomePage from './pages/WelcomePage';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="welcome" replace />,
      },
      {
        path: 'welcome',
        element: <WelcomePage />
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'auth',
        element: <AuthPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;