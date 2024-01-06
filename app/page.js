"use client";
import React, { useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

// Um componente que renderiza um botão de input da imagem e um elemento de imagem
const ImageInput = ({ onImageChange }) => {
  const inputRef = useRef();
  const imageRef = useRef();

  // Uma função que é chamada quando o usuário seleciona uma imagem
  const handleChange = async (event) => {
    // Obter o arquivo da imagem
    const file = event.target.files[0];
    if (file) {
      // Criar um objeto URL para a imagem
      const url = URL.createObjectURL(file);
      // Atualizar o elemento de imagem com a URL
      imageRef.current.src = url;
      // Esperar o elemento de imagem carregar
      await new Promise((resolve) => {
        imageRef.current.onload = resolve;
      });
      // Chamar a função de callback com o elemento de imagem
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
      <img ref={imageRef} width="300" />
    </div>
  );
};

// Um componente que renderiza a resposta da classificação usando um elemento de texto
const ClassificationResult = ({ result }) => {
  if (result) {
    // Extrair a classe e a confiança do resultado
    const { className, probability } = result;
    // Converter a confiança em porcentagem
    const percentage = (probability * 100).toFixed(2);
    // Retornar um elemento de texto com a classe e a confiança
    return (
      <p>
        A imagem é um(a) <b>{className}</b> com <b>{percentage}%</b> de
        confiança.
      </p>
    );
  } else {
    // Retornar um elemento de texto vazio
    return <p></p>;
  }
};

// O componente principal da página
const Home = () => {
  // Criar um estado para armazenar o modelo MobileNet
  const [model, setModel] = useState(null);
  // Criar um estado para armazenar o resultado da classificação
  const [result, setResult] = useState(null);

  // Uma função que carrega o modelo MobileNet usando a função tf.loadGraphModel
  const loadModel = async () => {
    // Carregar o modelo a partir de uma URL
    const model = await mobilenet.load();
    // Atualizar o estado com o modelo
    setModel(model);
    // Mostrar uma mensagem no console
    console.log("Modelo carregado");
  };

  // Uma função que passa a imagem do usuário como entrada para o modelo usando a função tf.browser.fromPixels
  const classifyImage = async (image) => {
    // Converter a imagem em um tensor
    const tensor = tf.browser.fromPixels(image);
    // Classificar o tensor usando o modelo
    const predictions = await model.classify(tensor);
    // Obter a primeira predição
    const result = predictions[0];
    // Atualizar o estado com o resultado
    setResult(result);
    // Mostrar o resultado no console
    console.log(result);
  };

  // Uma função que é chamada quando a página é montada
  const handleMount = () => {
    // Carregar o modelo
    loadModel();
  };

  // Usar o efeito React para chamar a função handleMount
  React.useEffect(handleMount, []);

  return (
    <div>
      <h1>Classificador de ursos</h1>
      <p>
        Selecione uma imagem de um urso ou um urso de pelúcia e veja o resultado
        da classificação.
      </p>
      <ImageInput onImageChange={classifyImage} />
      <ClassificationResult result={result} />
    </div>
  );
};

export default Home;