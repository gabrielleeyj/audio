import { lazy, Suspense, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./context/RequireAuth";
import Layout from "./layout";

const Login = lazy(() => import("./pages/LoginPage"));
const Home = lazy(() => import("./pages/HomePage"));
const Profile = lazy(() => import("./pages/ProfilePage"));
const Register = lazy(() => import("./pages/RegisterPage"));
const Upload = lazy(() => import("./pages/UploadPage"));
const NotFound = lazy(() => import("./pages/NotFoundPage"));

import './App.css'

function App() {
  
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
    createTheme({
      palette: {
        mode: prefersDarkMode ? "dark" : "light",
      },
    }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
     <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <Suspense fallback={<>...</>}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense fallback={<>...</>}>
                <Register />
              </Suspense>
            }
          />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route index element={<Home />} />
            <Route 
              path="Upload"
              element={
                <Suspense fallback={<>...</>}>
                  <Upload />
                </Suspense>
              }
            />
            <Route 
              path="Profile"
              element={
                <Suspense fallback={<>...</>}>
                  <Profile />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<>...</>}>
                  <NotFound />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

