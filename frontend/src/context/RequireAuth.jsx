import { useLocation, Navigate } from "react-router-dom";
import { parseClaims } from "../utils/jwt";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const token = sessionStorage.getItem("jwt");

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const claims = parseClaims(token);
  dayjs.extend(relativeTime);
  const now = dayjs();
  const expiry = dayjs.unix(claims.exp);

  // If token is expired, redirect to login
  const isExpired = now.diff(expiry, 'h') > 1;
  if (isExpired) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated and token is valid, render the children
  return children;
};

export default RequireAuth;

