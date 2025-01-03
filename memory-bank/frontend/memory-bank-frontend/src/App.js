import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [memories, setMemories] = useState([]);
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState(null);

  // Fetch memories from the Flask backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/memories")
      .then((response) => response.json())
      .then((data) => setMemories(data))
      .catch((error) => console.error("Error fetching memories:", error));
  }, []);

  // Handle form submission for uploading a memory
  const handleUploadMemory = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", newImage);
    formData.append("description", newDescription);

    fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message)
        {
          // Refresh memories list
          fetch("http://127.0.0.1:5000/memories")
            .then((response) => response.json())
            .then((data) => setMemories(data));
          setNewDescription("");
          setNewImage(null);
        }
        else
        {
          console.error("Error uploading memory:", data.error);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Memory Bank</h1>

        {/* Upload Memory Form */}
        <form onSubmit={handleUploadMemory}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files[0])}
            required
          />
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Add a description"
            required
          />
          <button type="submit">Save Memory</button>
        </form>

        {/* Display Memories */}
        <div>
          <h2>Your Memories</h2>
          <ul>
            {memories.map((memory) => (
              <li key={memory.id}>
                <p>{memory.description}</p>
                <img
                  src={`http://127.0.0.1:5000/uploads/${memory.image_filename}`}
                  alt={memory.description}
                  style={{ width: "200px", height: "auto" }}
                />
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
