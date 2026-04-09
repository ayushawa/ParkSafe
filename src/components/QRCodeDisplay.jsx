import { QrCode } from 'lucide-react';

const QRCodeDisplay = ({ id, validUntil, isActive }) => {
  return (
    <div 
      className="flex-col items-center justify-center p-4 w-full"
      style={{
        backgroundColor: isActive ? '#ffffff' : 'var(--surface-color-elevated)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        color: isActive ? '#000000' : 'var(--text-secondary)'
      }}
    >
      <div 
        className="flex items-center justify-center p-4 mb-4"
        style={{
          border: `4px solid ${isActive ? '#000000' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-md)',
          width: '200px',
          height: '200px'
        }}
      >
        {/* Placeholder for real QR code */}
        <QrCode size={160} color={isActive ? '#000000' : 'var(--border-color)'} strokeWidth={1} />
      </div>
      
      <div className="text-body-strong flex items-center justify-center" style={{ color: isActive ? '#000000' : 'var(--text-secondary)'}}>
        ID: {id}
      </div>
      {validUntil && isActive && (
        <div className="text-caption mt-2" style={{ color: '#666666' }}>
          Valid until {validUntil}
        </div>
      )}
      {!isActive && (
        <div className="text-caption mt-2 text-danger">
          EXPIRED
        </div>
      )}
    </div>
  );
};

export default QRCodeDisplay;
