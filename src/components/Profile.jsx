import { useState } from 'react';
import { auth, db } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        // Update auth profile
        await updateProfile(user, {
          displayName: username
        });

        // Update in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          username: username,
          email: user.email,
          uid: user.uid
        }, { merge: true });

        navigate('/chat');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Set Your Username</h2>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Save Username</button>
      </form>
    </div>
  );
}

export default Profile;
