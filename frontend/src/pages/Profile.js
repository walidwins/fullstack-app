import { useEffect, useState } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setProfile(data);
        else if (token === 'demo-token') {
          setProfile({ name: 'Utilisateur Démo', email: 'demo@example.com' });
        }
      })
      .catch(() => {
        if (token === 'demo-token') setProfile({ name: 'Utilisateur Démo', email: 'demo@example.com' });
      });
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h2>Profil</h2>
        {profile ? (
          <div>
            <p>Nom: {profile.name}</p>
            <p>Email: {profile.email}</p>
          </div>
        ) : (
          <p>Chargement...</p>
        )}
      </div>
    </div>
  );
}
