"use client"
import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

interface ImageInputProps {
  onImageChange: (image: tf.PixelData | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap) => void;
}

// Um componente que renderiza um botão de input da imagem e um elemento de imagem
const ImageInput: React.FC<ImageInputProps> = ({ onImageChange }) => {
  const [image, setImage] = useState(null);

  // Criar uma referência do React
  const imageRef = React.useRef(null); 

  // Uma função que é chamada quando o usuário seleciona uma imagem
  const handleChange = async (event: { target: { files: any[]; }; }) => {
    // Obter o arquivo da imagem
    const file = event.target.files[0];
    if (file) {
      // Criar um objeto URL para a imagem
      const url = URL.createObjectURL(file);
      // Atualizar o estado com a imagem
      setImage(url);
      // Esperar o elemento de imagem carregar
      await new Promise((resolve) => {
        // image.onload = resolve; // <--- Remova esta linha
        imageRef.current.onload = resolve; 
      });
      // Chamar a função de callback com a imagem
      // onImageChange(image); // <--- Remova esta linha
      onImageChange(imageRef.current); 
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
      <img ref={imageRef} src={image} width="300" />
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
        A imagem é um(a) <b>{className ?? "desconhecido"}</b> com <b>{percentage ?? "0"}%</b> de confiança.
      </p>
    );
  } else {
    // Retornar um elemento de texto com uma mensagem de erro
    return <p>Não foi possível classificar a imagem.</p>;
  }
};


// O componente principal da página
const Home = () => {
  // Criar um estado para armazenar o modelo MobileNet
  const [model, setModel] = useState<mobilenet.MobileNet>(null);
  // Criar um estado para armazenar o resultado da classificação
  const [result, setResult] = useState<mobilenet.ClassificationResult>(null);

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
  const classifyImage = async (image: tf.PixelData | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap) => {
    // Converter a imagem em um tensor
    const tensor = tf.browser.fromPixels(image);
    // Verificar se o modelo existe
    if (model) {
      // Classificar o tensor usando o modelo
      const predictions = await model?.classify(tensor);
      // Obter a primeira predição
      const result = predictions[0];
      // Atualizar o estado com o resultado
      setResult(result);
      // Mostrar o resultado no console
      console.log(result);
    } else {
      // Mostrar uma mensagem de erro no console
      console.error("O modelo ainda não foi carregado");
    }
  };

  // Uma função que é chamada quando a página é montada
  const handleMount = () => {
    // Carregar o modelo
    loadModel();
  };

  // Usar o efeito React para chamar a função handleMount
  useEffect(handleMount, []);

  return (
    <div>
      <h1>Classificador de ursos</h1>
      <p>
        Selecione uma imagem de um urso ou um urso de pelúcia e veja o resultado da classificação.
      </p>
      <ImageInput onImageChange={classifyImage} />
      <ClassificationResult result={result} />
    </div>
  );
};

export default Home;
