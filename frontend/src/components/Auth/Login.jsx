import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../utils/api';
import Logo from '../../components/Logo';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData.username, formData.password);
      
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      padding: "40px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        width: "100%",
        maxWidth: "1200px",
        height: "680px",
        background: "white",
        borderRadius: "24px",
        boxShadow: "0 20px 80px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        border: "1px solid #e5e7eb"
      }}>
        {/* Left Panel - Branding */}
        <div style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)",
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Logo */}
          <div style={{
            width: "140px",
            height: "140px",
            marginBottom: "40px",
            borderRadius: "28px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <img 
              src="/assets/icons/logo.png" 
              alt="Department Lab Inventory" 
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain"
              }}
            />
          </div>

          {/* Text */}
          <h1 style={{
            color: "white",
            fontSize: "24px",
            fontWeight: 700,
            textAlign: "center",
            margin: 0
          }}>
            Department Lab Inventory
          </h1>
        </div>

        {/* Right Panel - Login Form */}
        <div style={{
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "white"
        }}>
          {/* Welcome Back */}
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#181529ff",
              marginBottom: "8px"
            }}>
              Welcome Back
            </h2>
            <p style={{
              color: "#6b7280",
              fontSize: "16px"
            }}>
              Sign in to access your lab management dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "24px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            {/* Username Field */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#374151"
              }}>
                Username
              </label>
              <div style={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #d1d5db",
                transition: "all 0.2s ease",
                ":focus-within": {
                  borderColor: "#4f46e5",
                  boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)"
                }
              }}>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "none",
                    fontSize: "15px",
                    outline: "none",
                    background: "transparent",
                    color: "#111827",
                    "::placeholder": {
                      color: "#9ca3af"
                    }
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px"
              }}>
                <label style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151"
                }}>
                  Password
                </label>
                <Link 
                  to="/forgot-password" 
                  style={{
                    fontSize: "13px",
                    color: "#4f46e5",
                    textDecoration: "none",
                    fontWeight: 500,
                    ":hover": {
                      textDecoration: "underline"
                    }
                  }}
                >
                  Forgot password?
                </Link>
              </div>
              <div style={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #d1d5db",
                transition: "all 0.2s ease",
                ":focus-within": {
                  borderColor: "#4f46e5",
                  boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)"
                }
              }}>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "none",
                    fontSize: "15px",
                    outline: "none",
                    background: "transparent",
                    color: "#111827",
                    "::placeholder": {
                      color: "#9ca3af"
                    }
                  }}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "32px"
            }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                userSelect: "none"
              }}>
                <div style={{
                  width: "18px",
                  height: "18px",
                  position: "relative"
                }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    style={{
                      width: "100%",
                      height: "100%",
                      appearance: "none",
                      border: "2px solid #d1d5db",
                      borderRadius: "4px",
                      margin: 0,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      ":checked": {
                        background: "#4f46e5",
                        borderColor: "#4f46e5"
                      }
                    }}
                  />
                </div>
                <span style={{ fontSize: "14px", color: "#4b5563" }}>
                  Remember me for 30 days
                </span>
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                marginBottom: "24px",
                opacity: loading ? 0.7 : 1,
                ":hover": !loading && {
                  transform: "translateY(-1px)",
                  boxShadow: "0 10px 30px rgba(30, 58, 95, 0.3)"
                }
              }}
            >
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <div style={{
                    width: "18px",
                    height: "18px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }} />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Sign Up Link */}
            <div style={{
              textAlign: "center",
              fontSize: "14px",
              color: "#6b7280"
            }}>
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                style={{
                  color: "#4f46e5",
                  textDecoration: "none",
                  fontWeight: 600,
                  ":hover": {
                    textDecoration: "underline"
                  }
                }}
              >
                Create account
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Login;