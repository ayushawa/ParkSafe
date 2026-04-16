import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <div className="page-container">
      <div className="wrapper">

        <h2 className="text-h2">Find Parking</h2>

        <div className="card">

          <div className="input-group">
            <label>Search Metro Station</label>
            <input
              className="input-field"
              placeholder="Enter station..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            className="btn-primary"
            onClick={() => navigate('/list', { state: { search } })}
          >
            Find Parking
          </button>

        </div>
      </div>
    </div>
  );
};

export default HomeScreen;