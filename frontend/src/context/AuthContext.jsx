import { createContext, useContext, useState } from "react";
import { parseClaims } from "../utils/jwt";
import axios from "../apis/axios";
import useAxiosAuth from "../apis/useAxiosAuth";
import { useNavigate } from "react-router-dom";

/**
 * @constant
 * @type {import('react').Context<AuthContext>}
 */
const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [admin, isAdmin] = useState(false);
  const axiosAuth = useAxiosAuth();
  const navigate = useNavigate();

  const signin = async (username, password) => {
  try {
    const res = await axios.post("/user/login", {
      username,
      password,
    });
    const token = res.data.token;
    sessionStorage.setItem("jwt", token);
    const claims = parseClaims(token);
    if (claims.role === "admin") {
      isAdmin(true);
    }
  } catch (e) {
    console.log("error: ", e);
  }
};
  const signout = async() => {
    try {
      const res = await axiosAuth.post("/user/logout")
      sessionStorage.removeItem("jwt");
      navigate("/login", {replace: true});
    } catch (e) {
      console.log("error: ", e);
    }
  };

  const token = () => {
    return sessionStorage.getItem("jwt");
  }

  const value = { token, admin, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * @typedef {object} AuthContext
 * @property {string} user
 * @property {(user: string) => Promise<void>} signin
 * @property {() => Promise<void>} signout
 */

export default AuthContext;
