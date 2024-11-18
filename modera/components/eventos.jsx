import React, { useState, useEffect } from 'react';
import Modal from "react-modal";
import '../components/css/Eventos.css';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventos, setSelectedEventos] = useState(null);
  const [advertencia, setAdvertencia] = useState('');  

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch('https://volun-api-eight.vercel.app/eventos/');
        if (!response.ok) {
          throw new Error('Erro ao buscar os eventos');
        }
        const data = await response.json();
        setEventos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  // LocalStorage para registrar as ações
  const registrarAcao = (acao) => {
    const historico = JSON.parse(localStorage.getItem('historico')) || [];
    historico.push(acao);
    localStorage.setItem('historico', JSON.stringify(historico));
  };

  // Função para excluir um evento
  const handleDelete = async (evento) => {
    try {
      // Fazendo a requisição DELETE para a API para excluir o evento
      const response = await fetch(`https://volun-api-eight.vercel.app/eventos/${evento._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir o evento');
      }



      // Remover o evento da lista 
      setEventos((prevEventos) =>
        prevEventos.filter((e) => e.id !== evento._id)
      );

      // Registrar a ação de exclusão
      registrarAcao(`Moderador excluiu o evento: ${evento.titulo}`);
      console.log(`Excluir evento: ${evento.titulo}`);

    } catch (err) {
      setError(err.message);
      console.error('Erro ao excluir o evento:', err);
    }
  };

  const handleAdvertir = (evento) => {
    setSelectedEventos(evento); 
    setIsModalOpen(true); // Abre o modal
  };

   // aplicar a advertência e fechar o modal
   const handleApplyAdvertencia = () => {
    if (!advertencia) {
      alert('Por favor, insira uma advertência.');// mensagem caso campo esteja vazio
      return;
    }

     // Registrar a ação de advertência
     registrarAcao(`Moderador advertiu o Evento: ${selectedEventos.titulo} com a mensagem: "${advertencia}"`);


     // Fechar o modal
     setIsModalOpen(false);
     setAdvertencia(''); 
     console.log(`Advertência aplicada ao usuário: ${selectedEventos.titulo}`);
   };


 


  return (
    // Card
    <div className="eventos-container">
      {eventos.map(evento => (
        <div className="card" key={evento._id}>
          <div className="card-capa"></div>
          <h2 className="card-title">{evento.titulo}</h2>

          <div className="card-description">{evento.descricao}</div>

          <div className="card-text-first">
            <strong>{evento.data_inicio}</strong>
          </div>

          <div className="card-text-second">
            <span>{evento.data_fim}</span>
          </div>

          <button className="card-details">
            <p>Mais detalhes</p>
          </button>



          {/* Ações */}
          <div className="card-actions">
            <button
              onClick={() => handleDelete(evento)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              aria-label="Delete"
            >
              <img 
                src='src/components/modera/assets/img/image 34.png' 
                alt='Excluir' 
                className='icon' 
                style={{ marginRight: '10px' }} 
              />
            </button>

            <button
              onClick={() => handleAdvertir(evento)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              aria-label="Warn"
            >
              <img 
                src='src/components/modera/assets/img/image 33.png' 
                alt='Advertir' 
                className='icon' 
              />
            </button>
          </div>

        </div>
      ))}

      {/* Modal para inserir advertência */}
      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={() => setIsModalOpen(false)} 
        contentLabel="Advertir Evento"
        ariaHideApp={false}
        className="ReactModal__Content"  //  classe personalizada para o conteúdo do modal
        overlayClassName="ReactModal__Overlay"  //  classe personalizada para o overlay
      >


        <h2>Advertir Usuário: {selectedEventos?.nome}</h2>
        <textarea 
          value={advertencia} 
          onChange={(e) => setAdvertencia(e.target.value)} 
          placeholder="Digite a advertência aqui..."
          rows="5"
          className="modal-textarea"  //  classe personalizada para a textarea
        />
        
       
        <div className="modal-buttons">
          <button onClick={handleApplyAdvertencia}>Aplicar Advertência</button>
          <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
        </div>
      </Modal>
    </div>
    

  


  );
};

export default Eventos;


 