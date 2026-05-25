import { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Unauthorized");
        }

        setProfile(data);
      } catch (err) {
        console.error(err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="card">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page">
        <div className="card">
          <p>Aucun profil trouve.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card profile-card">
        <h2>Profil utilisateur</h2>

        <div className="profile-info">
          <p>
            <strong>Nom :</strong> {profile.name}
          </p>
          <p>
            <strong>Email :</strong> {profile.email}
          </p>
        </div>
      </div>
    </div>
  );
}
