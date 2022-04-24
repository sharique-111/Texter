import './App.css';
import { Route } from 'react-router-dom';
import Homepage from './Pages/HomePage';
import Chatpage from './Pages/ChatPage';
function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact/>
      <Route path="/chats" component={Chatpage} exact/>
    </div>
  );
}

export default App;
