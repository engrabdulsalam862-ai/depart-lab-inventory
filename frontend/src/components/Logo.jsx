import React, { useState } from 'react';

const Logo = ({ size = "medium", showText = true, centered = false }) => {
  const [imageError, setImageError] = useState(false);
  
  const sizes = {
    small: { container: "48px", icon: "24px" },
    medium: { container: "64px", icon: "32px" },
    large: { container: "80px", icon: "40px" },
    xlarge: { container: "96px", icon: "48px" }
  };

  const textSizes = {
    small: "24px",
    medium: "32px",
    large: "40px",
    xlarge: "48px"
  };

  const currentSize = sizes[size] || sizes.medium;
  const currentTextSize = textSizes[size] || textSizes.medium;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      flexDirection: centered ? "column" : "row",
      gap: "16px",
      marginBottom: "32px",
      justifyContent: centered ? "center" : "flex-start"
    }}>
      {/* Logo Container with Enhanced Design */}
      <div style={{
        width: currentSize.container,
        height: currentSize.container,
        background: imageError 
          ? "linear-gradient(135deg, #f6f7faff 0%, #f8f7f8ff 100%)" 
          : "linear-gradient(135deg, #fdfdfdff 0%, #ffffffff 100%)",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 10px 40px rgba(79, 70, 229, 0.3)",
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.2)"
      }}>
        {/* Subtle pattern overlay */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.3
        }} />
        
        {/* Logo Content */}
        <div style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%"
        }}>
          {!imageError ? (
            <img 
              src="/assets/icons/logo.png"
              alt="Lab Inventory Logo"
              style={{
                width: "130%",
                height: "130%",
                objectFit: "contain",
                filter: "brightness(1.2) contrast(1.1)"
              }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div style={{
              color: "white",
              fontSize: currentSize.icon,
              fontWeight: "bold",
              fontFamily: "'Segoe UI', system-ui, sans-serif",
              textShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }}>
              <span style={{ fontSize: "0.8em" }}>L</span>
              <span style={{ fontSize: "0.6em", opacity: 0.9 }}>I</span>
            </div>
          )}
        </div>

        {/* Glow effect */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "120%",
          height: "120%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)",
          zIndex: 1
        }} />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div style={{ 
          textAlign: centered ? "center" : "left",
          lineHeight: 1.2
        }}>
          <h1 style={{
            margin: 0,
            fontSize: currentTextSize,
            fontWeight: 800,
            background: "linear-gradient(135deg, #f7f8ffff 0%, #f6f6ffff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.5px",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          }}>
            Lab Inventory
          </h1>
          <p style={{
            margin: "6px 0 0 0",
            fontSize: "14px",
            color: "#f2f0faff",
            fontWeight: 500,
            letterSpacing: "0.3px",
            fontFamily: "'Inter', sans-serif"
          }}>
            Department Management System
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;