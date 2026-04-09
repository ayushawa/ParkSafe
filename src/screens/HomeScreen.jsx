import { Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <div className="page-container" style={{ paddingBottom: '0', background: 'radial-gradient(circle at center, #0f172a, #020617)' }}>
      
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'rgba(59,130,246,0.15)',
        filter: 'blur(120px)',
        top: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 0
      }}></div>

      {/* Search Bar */}
      <div style={{ position: 'absolute', top: '20px', left: '16px', right: '16px', zIndex: 10 }}>
        <div 
          className="flex items-center p-4 gap-3 text-body"
          style={{
            backgroundColor: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff'
          }}
        >
          <Search size={20} color="#9ca3af" />

          <input
            type="text"
            placeholder="Search metro station..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: '#fff'
            }}
          />

          <button
            onClick={() => navigate('/list', { state: { search } })}
            style={{
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              color: '#fff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(59,130,246,0.5)'
            }}
          >
            Go
          </button>
        </div>
      </div>

      {/* Center Marker */}
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        zIndex: 5 
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 30px rgba(59,130,246,0.6)',
          animation: 'pulse 2s infinite'
        }}>
          <MapPin size={26} color="#fff" />
        </div>
      </div>

      {/* Bottom Panel */}
      <div style={{ 
        position: 'absolute', 
        bottom: '80px',
        left: '0', 
        right: '0', 
        height: '220px', 
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(14px)',
        borderTopLeftRadius: 'var(--radius-xl)',
        borderTopRightRadius: 'var(--radius-xl)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
        padding: '24px 20px',
        zIndex: 10,
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ 
          width: '40px', 
          height: '4px', 
          backgroundColor: 'rgba(255,255,255,0.2)', 
          borderRadius: '2px', 
          margin: '0 auto 20px auto' 
        }}></div>
        
        <h2 className="text-h2 mb-4" style={{ color: '#fff' }}>Find Parking</h2>
        
        <button 
          onClick={() => navigate('/list', { state: { search } })}
          className="w-full text-body-strong flex justify-between items-center"
          style={{
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            color: '#ffffff',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: 'none',
            boxShadow: '0 10px 30px rgba(59,130,246,0.5)',
            cursor: 'pointer'
          }}
        >
          <span>Search Parking</span>
          <span 
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              padding: '4px 10px', 
              borderRadius: '20px',
              fontSize: '12px'
            }}
          >
            Go
          </span>
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.5); }
          70% { box-shadow: 0 0 0 25px rgba(59,130,246,0); }
          100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;