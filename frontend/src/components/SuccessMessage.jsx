// Mensagem de sucesso (usada no lugar de alert()).
function SuccessMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="sucesso-message" role="status">
      <p>{message}</p>
    </div>
  );
}

export default SuccessMessage;
