import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [links, setLinks] = useState([]);
  const [error, setError] = useState('');

  const BACKEND_URL = 'https://url-shortener-backend-ysangam45.onrender.com';

  // Fetch performance link records on application mount
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/links`);
      setLinks(response.data);
    } catch (err) {
      console.error('Error reading remote links matrix registry payload:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!longUrl.trim()) {
      setError('Please provide a destination URL path string.');
      return;
    }

    try {
      await axios.post(`${BACKEND_URL}/api/shorten`, { longUrl });
      setLongUrl('');
      fetchLinks(); // Pull fresh database rows
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Check backend hosting terminal states.');
    }
  };

  return (
    <div className="container">
      <header>
        <h1>FlowUrl</h1>
        <p>A full-stack, lightweight URL compression and analytics metrics platform.</p>
      </header>

      <main>
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Paste your long destination address link here..."
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
              />
              <button type="submit">Shorten</button>
            </div>
          </form>
          {error && <div className="error-banner">{error}</div>}
        </div>

        <div className="results-section">
          <h2>Active Links Matrix Dashboard</h2>
          <div className="link-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Original Link Destination</th>
                  <th>Compressed Alias</th>
                  <th>Clicks Tracker</th>
                </tr>
              </thead>
              <tbody>
                {links.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: '#94a3b8' }}>
                      No shortened links created yet.
                    </td>
                  </tr>
                ) : (
                  links.map((link) => (
                    <tr key={link._id}>
                      <td>
                        <div className="truncate">{link.longUrl}</div>
                      </td>
                      <td>
                        <a
                          href={`${BACKEND_URL}/${link.shortCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="alias-link"
                          onClick={() => setTimeout(fetchLinks, 1000)} // Live sync UI state after a user click event fires
                        >
                          {link.shortCode}
                        </a>
                      </td>
                      <td>
                        <span className="badge">{link.clicks} clicks</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;