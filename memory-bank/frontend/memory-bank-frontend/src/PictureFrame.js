import React, { useState, useEffect } from 'react';

const PictureFrame = () => {
  const [memories, setMemories] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Fetch memories using Fetch API
    fetch('http://localhost:5000/memories')
      .then((response) => response.json())
      .then((data) => setMemories(data))
      .catch((error) => console.error('Error fetching memories:', error));
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % memories.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + memories.length) % memories.length
    );
  };

  return (
    <div>
      {memories.length > 0 ? (
        <div>
          <img
            src={`http://localhost:5000/uploads/${memories[currentImageIndex].image_filename}`}
            alt={memories[currentImageIndex].description || 'Memory'}
            style={{ maxWidth: '100%', maxHeight: '100vh', objectFit: 'cover' }}
          />
          <p>{memories[currentImageIndex].description}</p>
          <button onClick={prevImage}>Previous</button>
          <button onClick={nextImage}>Next</button>
        </div>
      ) : (
        <p>No memories to display</p>
      )}
    </div>
  );
};

export default PictureFrame;
