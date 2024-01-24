"use client";
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

// A component that renders an image input button and an image element
const ImageInput = ({ onImageChange }) => {
  const inputRef = useRef();
  const imageRef = useRef();

  // A function called when the user selects an image
  const handleChange = async (event) => {
    // Get the image file
    const file = event.target.files[0];
    if (file) {
      // Create a URL object for the image
      const url = URL.createObjectURL(file);

      // Wait for the image element to load
      await new Promise((resolve) => {
        // Create a new image element
        const newImage = new Image();
        newImage.onload = () => {
          resolve();
          // Call the callback function with the new image element
          onImageChange(newImage);
        };
        // Set the src property of the new image element
        newImage.src = url;
      });
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <input
        type="file"
        accept="image/*"
        id="imageInput"
        ref={inputRef}
        onChange={handleChange}
        style={{ position: 'absolute', top: '-9999px' }}
      />
      <label
        htmlFor="imageInput"
        style={{
          border: '1px solid #ced4da',
          padding: '0.375rem 0.75rem',
          cursor: 'pointer',
          borderRadius: '0.25rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        Select an Image
      </label>
      {imageRef.current && (
        <img
          ref={imageRef}
          alt="Uploaded Image Preview"
          style={{ marginTop: '0.5rem', maxWidth: '200px' }}
        />
      )}
    </div>
  );
};


// A component that renders the classification result using a text element
const ClassificationResult = ({ result }) => {
  if (result) {
    const { className, probability } = result;
    const percentage = (probability * 100).toFixed(2);
    return (
      <p style={{ textAlign: 'center', fontSize: '1.5rem' }}>
        The image is a <b>{className}</b> with <b>{percentage}%</b> confidence.
      </p>
    );
  }

  return <p style={{ textAlign: 'center' }}>Select an image to classify.</p>;
};

// The main component of the page
const Home = () => {
  // Create state to store the MobileNet model
  const [model, setModel] = useState(null);
  // Create state to store the classification result
  const [result, setResult] = useState(null);
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // A function that loads the MobileNet model using the tf.loadGraphModel function
  const loadModel = async () => {
    // Load the model from a URL
    const model = await mobilenet.load();
    // Update the state with the model
    setModel(model);
    // Show a message in the console
    console.log("Model loaded");
  };

  // A function that passes the user's image as input to the model using the tf.browser.fromPixels function
  const classifyImage = async (image) => {
    // Convert the image to a tensor
    const tensor = tf.browser.fromPixels(image);
    // Classify the tensor using the model
    const predictions = await model.classify(tensor);
    // Get the first prediction
    const result = predictions[0];
    // Update the state with the result
    setResult(result);
    // Show the result in the console
    console.log(result);
  };

  // A function called when the page is mounted
  const handleMount = () => {
    // Load the model
    loadModel();
  };

  // Use the React effect to call the handleMount function
  useEffect(handleMount, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between' }}>
      <div style={{ margin: 'auto', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: isDarkMode ? '#343a40' : '#fff', color: isDarkMode ? '#fff' : '#000' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Bear Classifier</h1>
        <ImageInput onImageChange={classifyImage} />
        <ClassificationResult result={result} isProcessing={isProcessing} error={error} />
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ marginTop: '1rem', padding: '0.375rem 0.75rem', border: '1px solid #6c757d', borderRadius: '0.25rem', cursor: 'pointer', backgroundColor: isDarkMode ? '#6c757d' : '#fff', color: isDarkMode ? '#fff' : '#000' }}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <footer style={{ textAlign: 'center', marginTop: '1rem', padding: '1rem', backgroundColor: isDarkMode ? '#343a40' : '#f8f9fa', borderTop: '1px solid #ced4da', color: isDarkMode ? '#fff' : '#000' }}>
        <p>By Leo to Ana <span role="img" aria-label="heart">❤️</span> S2</p>
        <p>
          LinkedIn:
          <a href="https://www.linkedin.com/in/leojunioy" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '0.5rem', color: isDarkMode ? '#fff' : '#000' }}>Leonardo Basso</a>
        </p>
      </footer>
    </div>
  );
};

export default Home;