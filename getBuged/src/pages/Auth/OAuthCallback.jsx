import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function OAuthCallback() {
  const { user, accessToken, apiBase } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("accessToken");
    const email = params.get("email");
    const name = params.get("name");

    if (token && email) {
      const userData = { id: email, email, name, role: "user" };
      saveAuth(userData, token);
      fetchProfile().catch(() => {});
    }

    navigate("/playground", { replace: true });
  }, [location.search, navigate, apiBase, user, accessToken, saveAuth]);

  return null;
}

