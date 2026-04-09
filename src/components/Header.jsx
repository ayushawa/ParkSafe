import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, showBack = false, rightAction }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="flex items-center justify-between p-4" 
      style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'rgba(28, 28, 30, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-color)',
        minHeight: '60px'
      }}
    >
      <div className="flex-1">
        {showBack && (
          <button 
            onClick={() => navigate(-1)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--accent-color)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ChevronLeft size={28} />
          </button>
        )}
      </div>
      <h2 className="text-h2 flex-2 text-center" style={{ margin: 0 }}>
        {title}
      </h2>
      <div className="flex-1 flex justify-end">
        {rightAction}
      </div>
    </div>
  );
};

export default Header;
