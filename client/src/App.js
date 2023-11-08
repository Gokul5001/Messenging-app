import ChatContainer from "./components/ChatContainer.js";
import backgroundImg from "../src/2345.jpg"; // Import your background image

function App() {
  const containerStyle = {
    backgroundColor: "#0174BE",
    maxHeight: "100%",
    padding: 10,
    backgroundImage: `url(${backgroundImg})`, // Set the background image
    backgroundSize: "cover", // Adjust background size as needed
  };

  return (
    <div style={containerStyle}>
      <ChatContainer />
    </div>
  );
}

export default App;
