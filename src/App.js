import React, { useEffect } from 'react';
import { useAuth0 } from './auth0';
import ChatView from './Chat';

function App() {
  useEffect(() => {}, []);

  const { loading, user, loginWithRedirect } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {!user && loginWithRedirect({})}
      {user && <ChatView />}
    </div>
  );

  //{user && <ChatView />}
}

export default App;