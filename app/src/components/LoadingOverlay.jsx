import React from 'react';
import ReactDOM from 'react-dom';
import '../App.css'; // Importar o CSS para estilização

const LoadingOverlay = ({tryToReconnectFn}) => {
  return ReactDOM.createPortal(
    <div className="loading-overlay">
      <div className="loading-spinner">
        Carregando...
      </div>
      <button
      style={{
        padding: "10px 25px",
        backgroundColor: "green",
        color: "white",
        borderRadius: "12px",
        marginTop: "20px",
      }}
      onClick={tryToReconnectFn} className="reconnect-button">
        Tentar reconectar
      </button>
    </div>,
    document.body
  );
};

export default LoadingOverlay;
