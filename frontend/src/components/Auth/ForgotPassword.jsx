import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, verifyRecoveryCode, resetPassword } from '../../utils/api';
import Logo from '../../components/Logo';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    recovery_code: '',
    new_password: '',
    confirm_new_password: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await forgotPassword(formData.email);
      setMessage(`Recovery code sent to ${formData.email}`);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send recovery code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyRecoveryCode(formData.email, formData.recovery_code);
      setMessage('Code verified successfully!');
      setTimeout(() => setStep(3), 1000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid recovery code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(formData);
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password');
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

  const passwordStrength = getPasswordStrength(formData.new_password);

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
        {/* Left Panel - Process */}
        <div style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%)",
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Decorative elements */}
          <div style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            filter: "blur(40px)"
          }} />
          
          <div style={{
            position: "absolute",
            bottom: "-150px",
            left: "-150px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            filter: "blur(40px)"
          }} />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <Logo size="large" showText={true} centered={true} />
            
            <div style={{ marginTop: "60px" }}>
              <h2 style={{
                color: "white",
                fontSize: "28px",
                fontWeight: 700,
                marginBottom: "16px",
                lineHeight: 1.3
              }}>
                Password Recovery Process
              </h2>
              
              <p style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: "16px",
                lineHeight: 1.6,
                marginBottom: "40px"
              }}>
                Follow these simple steps to securely reset your password and regain access to your account.
              </p>

              {/* Steps */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px"
              }}>
                {[
                  { step: 1, title: "Enter Email", description: "Provide your registered email address" },
                  { step: 2, title: "Verify Code", description: "Enter the 4-digit recovery code sent to your email" },
                  { step: 3, title: "New Password", description: "Create a new strong password for your account" }
                ].map((item) => (
                  <div key={item.step} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    opacity: step >= item.step ? 1 : 0.5
                  }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      background: step >= item.step ? "white" : "rgba(255, 255, 255, 0.2)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: step >= item.step ? "#4f46e5" : "rgba(255, 255, 255, 0.7)",
                      fontWeight: 700,
                      fontSize: "18px",
                      flexShrink: 0
                    }}>
                      {item.step}
                    </div>
                    <div>
                      <div style={{
                        color: "white",
                        fontSize: "18px",
                        fontWeight: 600,
                        marginBottom: "4px"
                      }}>
                        {item.title}
                      </div>
                      <div style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: "14px"
                      }}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div style={{
            position: "absolute",
            bottom: "40px",
            left: "60px",
            right: "60px",
            padding: "16px",
          
            borderRadius: "12px",
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: "13px"
          }}>
           
          </div>
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
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "8px"
            }}>
              {step === 1 && "Reset Password"}
              {step === 2 && "Verify Recovery Code"}
              {step === 3 && "Create New Password"}
            </h2>
            <p style={{
              color: "#6b7280",
              fontSize: "16px"
            }}>
              {step === 1 && "Enter your email to receive a recovery code"}
              {step === 2 && "Check your email and enter the verification code"}
              {step === 3 && "Create a new strong password for your account"}
            </p>
          </div>

          {/* Messages */}
          {message && (
            <div style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#166534",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "24px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              {message}
            </div>
          )}

          {error && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "24px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              {error}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleRequestCode}>
              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151"
                }}>
                  Email Address
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
                    padding: "14px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "12px",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.2s ease",
                    ":focus": {
                      borderColor: "#4f46e5",
                      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)"
                    }
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%)",
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
                    boxShadow: "0 10px 30px rgba(79, 70, 229, 0.3)"
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
                    Sending Code...
                  </div>
                ) : (
                  "Send Recovery Code"
                )}
              </button>

              <div style={{
                textAlign: "center",
                fontSize: "14px",
                color: "#6b7280"
              }}>
                <Link 
                  to="/login" 
                  style={{
                    color: "#4f46e5",
                    textDecoration: "none",
                    fontWeight: 600,
                    ":hover": {
                      textDecoration: "underline"
                    }
                  }}
                >
                  ← Back to login
                </Link>
              </div>
            </form>
          )}

          {/* Step 2: Verify Code */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode}>
              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151"
                }}>
                  4-digit Recovery Code
                </label>
                <input
                  type="text"
                  name="recovery_code"
                  value={formData.recovery_code}
                  onChange={handleChange}
                  placeholder="Enter 4-digit code"
                  required
                  maxLength="4"
                  pattern="\d{4}"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "12px",
                    fontSize: "20px",
                    outline: "none",
                    textAlign: "center",
                    letterSpacing: "8px",
                    transition: "all 0.2s ease",
                    ":focus": {
                      borderColor: "#4f46e5",
                      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)"
                    }
                  }}
                />
                <div style={{
                  marginTop: "8px",
                  fontSize: "13px",
                  color: "#6b7280",
                  textAlign: "center"
                }}>
                  Check your email for the recovery code
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || formData.recovery_code.length !== 4}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: loading || formData.recovery_code.length !== 4
                    ? "#d1d5db"
                    : "linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%)",
                  color: loading || formData.recovery_code.length !== 4 ? "#9ca3af" : "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: loading || formData.recovery_code.length !== 4 ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  marginBottom: "24px",
                  ":hover": !loading && formData.recovery_code.length === 4 && {
                    transform: "translateY(-1px)",
                    boxShadow: "0 10px 30px rgba(79, 70, 229, 0.3)"
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
                    Verifying...
                  </div>
                ) : (
                  "Verify Code"
                )}
              </button>

              <div style={{
                textAlign: "center",
                fontSize: "13px",
                color: "#6b7280"
              }}>
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleRequestCode}
                  disabled={loading}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#4f46e5",
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    textDecoration: "underline",
                    fontSize: "13px",
                    padding: 0,
                    ":hover": !loading && {
                      color: "#3730a3"
                    }
                  }}
                >
                  Resend code
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151"
                }}>
                  New Password
                </label>
                <input
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  required
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "12px",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.2s ease",
                    ":focus": {
                      borderColor: "#4f46e5",
                      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)"
                    }
                  }}
                />
                
                {/* Password Strength */}
                {formData.new_password && (
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

              <div style={{ marginBottom: "32px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151"
                }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirm_new_password"
                  value={formData.confirm_new_password}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  required
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: formData.new_password && formData.new_password !== formData.confirm_new_password 
                      ? "1px solid #ef4444" 
                      : "1px solid #d1d5db",
                    borderRadius: "12px",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.2s ease",
                    ":focus": {
                      borderColor: formData.new_password && formData.new_password !== formData.confirm_new_password 
                        ? "#ef4444" 
                        : "#4f46e5",
                      boxShadow: formData.new_password && formData.new_password !== formData.confirm_new_password 
                        ? "0 0 0 3px rgba(239, 68, 68, 0.1)" 
                        : "0 0 0 3px rgba(79, 70, 229, 0.1)"
                    }
                  }}
                />
                {formData.new_password && formData.new_password !== formData.confirm_new_password && (
                  <div style={{
                    marginTop: "8px",
                    fontSize: "13px",
                    color: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    Passwords don't match
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || formData.new_password !== formData.confirm_new_password}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: loading || formData.new_password !== formData.confirm_new_password
                    ? "#d1d5db"
                    : "linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%)",
                  color: loading || formData.new_password !== formData.confirm_new_password ? "#9ca3af" : "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: loading || formData.new_password !== formData.confirm_new_password ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  marginBottom: "24px",
                  ":hover": !loading && formData.new_password === formData.confirm_new_password && {
                    transform: "translateY(-1px)",
                    boxShadow: "0 10px 30px rgba(79, 70, 229, 0.3)"
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
                    Resetting Password...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </button>

              <div style={{
                textAlign: "center",
                fontSize: "14px",
                color: "#6b7280"
              }}>
                Remember your password?{" "}
                <Link 
                  to="/login" 
                  style={{
                    color: "#4f46e5",
                    textDecoration: "none",
                    fontWeight: 600,
                    ":hover": {
                      textDecoration: "underline"
                    }
                  }}
                >
                  Sign in here
                </Link>
              </div>
            </form>
          )}
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

export default ForgotPassword;