import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, showBack = false, rightAction }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        padding: '16px 20px',
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ flex: 1 }}>
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={26} color="#0f172a" />
          </button>
        )}
      </div>

      <h2 style={{ flex: 2, textAlign: 'center', margin: 0 }}>
        {title}
      </h2>

      <div style={{ flex: 1, textAlign: 'right' }}>
        {rightAction}
      </div>
    </div>
  );
};

export default Header;