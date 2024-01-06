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
      // Update the image element with the URL
      imageRef.current.src = url;
      // Wait for the image element to load
      await new Promise((resolve) => {
        imageRef.current.onload = resolve;
      });
      // Call the callback function with the image element
      onImageChange(imageRef.current);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleChange}
      />
      <img ref={imageRef} width="300" alt="Selected" />
    </div>
  );
};

// A component that renders the classification result using a text element
const ClassificationResult = ({ result }) => {
  if (result) {
    // Extract class and confidence from the result
    const { className, probability } = result;
    // Convert confidence to percentage
    const percentage = (probability * 100).toFixed(2);
    // Return a text element with class and confidence
    return (
      <p>
        The image is a <b>{className}</b> with <b>{percentage}%</b> confidence.
      </p>
    );
  } else {
    // Return an empty text element
    return <p></p>;
  }
};

// The main component of the page
const Home = () => {
  // Create state to store the MobileNet model
  const [model, setModel] = useState(null);
  // Create state to store the classification result
  const [result, setResult] = useState(null);

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
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-8 bg-gray-800 rounded shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-gray-200">Bear Classifier</h1>
        <h2 className="text-xl text-gray-400 mb-4">By Leo to Ana S2</h2>
        <h2 className="text-xl text-gray-400 mb-4">A primeira imagem não gera classificação (preciso resolver esse bug)</h2>
        <p className="text-gray-300 mb-6">
          Select an image of a bear or a teddy bear and see the classification result.
        </p>
        <ImageInput onImageChange={classifyImage} />
        <ClassificationResult result={result} />
      </div>
    </div>
  );
};

export default Home;
