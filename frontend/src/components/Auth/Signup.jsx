import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../../utils/api';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
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
    setSuccess('');
    setLoading(true);

    try {
      const response = await signup(formData);
      
      setSuccess(`Account created successfully! Your recovery code is: ${response.recovery_code}`);
      
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (err) {
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          setError(err.response.data.detail);
        } else if (Array.isArray(err.response.data.detail)) {
          setError(err.response.data.detail.map(d => d.msg).join(', '));
        }
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, color: '#e5e7eb', text: '' };
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    let color = '#ef4444';
    let text = 'Weak';
    if (strength >= 50) { color = '#f59e0b'; text = 'Fair'; }
    if (strength >= 75) { color = '#10b981'; text = 'Good'; }
    if (strength === 100) { color = '#059669'; text = 'Strong'; }

    return { strength, color, text };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f8fafc 0%, #eff5faff 100%)",
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

        {/* Right Panel - Form */}
        <div style={{
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "white",
          overflowY: "auto"
        }}>
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#181529ff",
              marginBottom: "8px"
            }}>
              Create Account
            </h2>
            <p style={{
              color: "#6b7280",
              fontSize: "16px"
            }}>
              Join to manage your lab inventory
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div style={{
              background: "#faf0f0ff",
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

          {success && (
            <div style={{
              background: "#fafffbff",
              border: "1px solid #bbf7d0",
              color: "#166534",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "24px",
              fontSize: "14px"
            }}>
              <div style={{ fontWeight: 600, marginBottom: "6px" }}>Account Created Successfully!</div>
              <div>{success}</div>
              <div style={{ marginTop: "10px", fontSize: "13px", color: "#059669", fontWeight: 600 }}>
                Redirecting to login in 5 seconds...
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px"
            }}>
              {/* Username */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151"
                }}>
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose username"
                  required
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s ease"
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151"
                }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s ease"
                  }}
                />
              </div>
            </div>

            {/* Full Name */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#374151"
              }}>
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.2s ease"
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#374151"
              }}>
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.2s ease"
                }}
              />
              
              {/* Password Strength */}
              {formData.password && (
                <div style={{ marginTop: "12px" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                    fontSize: "13px"
                  }}>
                    <span style={{ color: passwordStrength.color, fontWeight: 600 }}>
                      Password Strength: {passwordStrength.text}
                    </span>
                    <span style={{ color: passwordStrength.color, fontWeight: 600 }}>
                      {passwordStrength.strength}%
                    </span>
                  </div>
                  <div style={{
                    width: "100%",
                    height: "6px",
                    background: "#e5e7eb",
                    borderRadius: "3px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${passwordStrength.strength}%`,
                      height: "100%",
                      background: passwordStrength.color,
                      borderRadius: "3px",
                      transition: "all 0.3s ease"
                    }} />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: "32px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#374151"
              }}>
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: formData.confirm_password && formData.password !== formData.confirm_password 
                    ? "1px solid #ef4444" 
                    : "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.2s ease"
                }}
              />
              {formData.confirm_password && formData.password !== formData.confirm_password && (
                <div style={{
                  marginTop: "8px",
                  fontSize: "13px",
                  color: "#ef4444"
                }}>
                  Passwords don't match
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || formData.password !== formData.confirm_password}
              style={{
                width: "100%",
                padding: "16px",
                background: loading || formData.password !== formData.confirm_password
                  ? "#d1d5db"
                  : "linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)",
                color: loading || formData.password !== formData.confirm_password ? "#9ca3af" : "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: loading || formData.password !== formData.confirm_password ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                marginBottom: "24px"
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            {/* Login Link */}
            <div style={{
              textAlign: "center",
              fontSize: "14px",
              color: "#6b7280"
            }}>
              Already have an account?{" "}
              <Link 
                to="/login" 
                style={{
                  color: "#1e3a5f",
                  textDecoration: "none",
                  fontWeight: 600
                }}
              >
                Sign in here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
