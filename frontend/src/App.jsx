import { RouterProvider, Route, createReactRouter } from '@tanstack/react-router';
import LoginPage from './pages/LoginPage';
import UploadPage from './pages/UploadPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './context/AuthContext';
import Snack, { SnackCtx, useSnackCtx } from './components/Snack';

// Define routes
const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'login',
  component: LoginPage,
});

const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'register',
  component: RegisterPage, 
});

const uploadRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: UploadPage,
  beforeLoad: ({ context: { token } }) => {
    if (!token) {
      return { redirect: '/login' };
    }
  },
});

const rootRoute = new Route({
  path: '/',
  component: () => <RouterOutlet />,
});

const routeTree = rootRoute.addChildren([loginRoute, registerRoute, uploadRoute]);
const router = createReactRouter({ routeTree });

const App = () => {
  const snackCtx = useSnackCtx();

  return (
    <AuthProvider>
      <SnackCtx.Provider value={snackCtx}>
        <RouterProvider router={router} context={{ token: localStorage.getItem('jwtToken') }} />
        <Snack />
      </SnackCtx.Provider>
    </AuthProvider>
  )
};

export default App;
