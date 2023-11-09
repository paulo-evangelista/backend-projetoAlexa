import React from 'react';
import ReactDOM from 'react-dom';
import '../App.css'; // Importar o CSS para estilização

const LoadingOverlay = () => {
  return ReactDOM.createPortal(
    <div className="loading-overlay">
      <div className="loading-spinner">
        Carregando...
      </div>
    </div>,
    document.body
  );
};

export default LoadingOverlay;
