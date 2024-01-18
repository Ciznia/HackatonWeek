
import './App.css';
import { Employee } from './components/employee.jsx';


function App() {
  return (
    <div className="App">
      <button className="connect-button">Se connecter</button>
      <header className="App-header">
        <Employee />
      </header>
    </div>
  );
}

export default App;
