import "./App.css";
import CharacterTable from "./components/CharacterTable";

function App() {
  const appStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const characterTableStyle = {
    width: "70%",
  };

  return (
    <div className="App" style={appStyle}>
      <div style={characterTableStyle}>
        <CharacterTable />
      </div>
    </div>
  );
}

export default App;
