import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    // Check if user has username
    if (!auth.currentUser.displayName) {
      navigate('/profile');
      return;
    }

    setUsername(auth.currentUser.displayName);

    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        }))
      );
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageText = newMessage.trim();
    
    if (messageText) {
      try {
        setNewMessage(''); // Clear input first
        await addDoc(collection(db, 'messages'), {
          text: messageText,
          timestamp: serverTimestamp(),
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          username: auth.currentUser.displayName // Added username
        });
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Error sending message. Please try again.");
      }
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await handleSubmit(e);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const messagesDiv = document.querySelector('.messages');
    if (messagesDiv) {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <header>
        <div>
          <h2>Quin</h2>
          <small>{username}</small>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <div className="messages">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`message ${msg.data.uid === auth.currentUser?.uid ? 'sent' : 'received'}`}
          >
            <p>{msg.data.text}</p>
            <small>{msg.data.username || msg.data.email}</small>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="chat-input-container">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
