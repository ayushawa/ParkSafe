const Button = ({ children, variant = 'primary', onClick, disabled, fullWidth }) => {
  const baseStyle = {
    padding: '16px',
    borderRadius: 'var(--radius-md)',
    fontWeight: '600',
    fontSize: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    width: fullWidth ? '100%' : 'auto',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--accent-color)',
      color: '#ffffff',
      boxShadow: disabled ? 'none' : '0 4px 12px rgba(0, 122, 255, 0.3)'
    },
    secondary: {
      backgroundColor: 'var(--surface-color-elevated)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
    },
    danger: {
      backgroundColor: 'rgba(255, 59, 48, 0.1)',
      color: 'var(--danger-color)',
    }
  };

  return (
    <button 
      onClick={disabled ? undefined : onClick}
      style={{ ...baseStyle, ...variants[variant] }}
      onPointerDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.98)')}
      onPointerUp={(e) => !disabled && (e.currentTarget.style.transform = 'scale(1)')}
      onPointerLeave={(e) => !disabled && (e.currentTarget.style.transform = 'scale(1)')}
    >
      {children}
    </button>
  );
};

export default Button;
