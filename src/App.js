import logo from './logo.svg';
import './App.css';
import Viewer3d from "./Viewer3d";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Viewer3d height="80vh"></Viewer3d>
    </div>
  );
}

export default App;
