import React, { useState, useEffect } from 'react';
import Modal from "react-modal";
import '../css/Usuario.css';

const Usuarios = ({ moderadorId }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [advertencia, setAdvertencia] = useState('');

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await fetch('https://volun-api-eight.vercel.app/usuarios/');
                if (!response.ok) {
                    throw new Error('Erro ao buscar os usuários');
                }
                const data = await response.json();
                setUsuarios(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, []);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>Erro: {error}</div>;
    }



    const registrarAcao = async (acao, alvoId, alvoTipo, descricao) => {
        try {
            const response = await fetch('https://volun-api-eight.vercel.app/acoes-moderacao', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    moderadorId, uid: 'nzzz6fDOI7UmFaelJuBUlBtJExd2',
                    alvoTipo, usuario,       // Tipo de alvo (ex.: "usuario")
                    alvoId, usuario_id,
                    acao, excluir, advertir, suspender,
                    descricao: descricao,      
                    data: new Date().toISOString(), 
                }),
            });
    
            if (!response.ok) {
                throw new Error('Erro ao registrar ação');
            }
        } catch (err) {
            console.error('Erro ao registrar ação:', err);
        }
    };
    



    const handleSuspender = async (usuario) => {
        if (window.confirm(`Tem certeza que deseja suspender o usuário ${usuario.nome}?`)) {
            const updatedUsuario = { ...usuario, status: 'suspenso' };
            setUsuarios((prevUsuarios) =>
                prevUsuarios.map((u) =>
                    u._id === usuario._id ? updatedUsuario : u
                )
            );
            await registrarAcao('suspender', usuario._id, 'usuario', `Usuário ${usuario.nome} suspenso`);

        }
    };



    const handleDelete = async (usuario) => {
        if (window.confirm(`Tem certeza que deseja excluir o usuário ${usuario.nome}?`)) {
            try {
                const response = await fetch(`https://volun-api-eight.vercel.app/usuarios/${usuario._id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorMsg = await response.text();
                    throw new Error(`Erro ao excluir o usuário: ${errorMsg}`);
                }

                setUsuarios((prevUsuarios) =>
                    prevUsuarios.filter((u) => u._id !== usuario._id)
                );
                await registrarAcao('excluir', usuario._id, 'usuario', `Usuário ${usuario.nome} excluído`);
            } catch (err) {
                setError(err.message);
            }
        }
    };



    const handleAdvertir = (usuario) => {
        setSelectedUsuario(usuario);
        setIsModalOpen(true);
    };

    const handleApplyAdvertencia = async () => {
        if (!advertencia) {
            alert('Por favor, insira uma advertência.');
            return;
        }
        await registrarAcao('advertir', selectedUsuario._id, 'usuario', `Advertência aplicada: ${advertencia}`);
        ;
        setIsModalOpen(false);
        setAdvertencia('');
    };

    return (
        <div className="lista-usuario">
            <h1>Página de Usuários</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Sobrenome</th>
                        <th>DDD</th>
                        <th>Telefone</th>
                        <th>Data de Nascimento</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario._id} style={{ color: usuario.status === 'suspenso' ? 'red' : 'black' }}>
                            <td>{usuario.nome}</td>
                            <td>{usuario.sobrenome}</td>
                            <td>{usuario.ddd}</td>
                            <td>{usuario.telefone}</td>
                            <td>{usuario.data_nascimento}</td>
                            <td>{usuario.status === 'suspenso' ? 'Suspenso' : 'Ativo'}</td>
                            <td>

         <button 
         onClick={() => handleDelete(usuario)}
         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
>
        <img
        src='src/assets/img/image 34.png'
           alt='Excluir'
           className='icon'
           style={{ marginRight: '10px' }}
        />
        </button>

        <button
         onClick={() => handleAdvertir(usuario)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
          <img
          src='src/assets/img/image 33.png'
          alt='Advertir'
           className='icon'
                  />
        </button>

        <button
                  onClick={() => handleSuspender(usuario)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <img
                    src='src\assets\img\ampulheta (1).png'
                    alt='Advertir'
                    className='icon'
                  />
                </button>

                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal 
        isOpen={isModalOpen} 
        onRequestClose={() => setIsModalOpen(false)} 
        contentLabel="Advertir Usuario"
        ariaHideApp={false}
        className="ReactModal__Content"
        overlayClassName="ReactModal__Overlay"
      >
        <h2>Advertir Evento: {selectedUsuario?.nome}</h2>
        <textarea 
          value={advertencia} 
          onChange={(e) => setAdvertencia(e.target.value)} 
          placeholder="Digite a advertência aqui..."
          rows="5"
          className="modal-textarea"
        />
        <div className="modal-buttons">
          <button onClick={handleApplyAdvertencia}>Aplicar Advertência</button>
          <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
        </div>
      </Modal>
        </div>
    );
};

export default Usuarios;

