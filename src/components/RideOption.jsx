const RideOption = ({ icon: Icon, title, time, price, selected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 mb-3"
      style={{
        backgroundColor: selected ? 'rgba(0, 122, 255, 0.1)' : 'var(--surface-color)',
        borderRadius: 'var(--radius-md)',
        border: `2px solid ${selected ? 'var(--accent-color)' : 'var(--border-color)'}`,
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      <div className="flex items-center gap-4">
        <div 
          className="flex justify-center items-center"
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: 'var(--bg-color)',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <Icon size={24} color={selected ? 'var(--accent-color)' : 'var(--text-primary)'} />
        </div>
        <div>
          <div className="text-body-strong">{title}</div>
          <div className="text-caption">{time} ETA</div>
        </div>
      </div>
      <div className="text-h3">
        ₹{price}
      </div>
    </div>
  );
};

export default RideOption;
