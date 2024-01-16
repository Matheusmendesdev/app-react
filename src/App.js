import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [jogadores, setJogadores] = useState([]);
  const [nome, setNome] = useState('');
  const [nivel, setNivel] = useState('');
  const [goleiro, setGoleiro] = useState(false);
  const [presenca, setPresenca] = useState(false);
  const [timesSorteados, setTimesSorteados] = useState([]);
  const [editando, setEditando] = useState(false);
  const [jogadorEditando, setJogadorEditando] = useState({});

  useEffect(() => {
    obterJogadores();
  }, []);

  const obterJogadores = async () => {
    try {
      const response = await axios.get('http://localhost:8989/jogadores');
      setJogadores(response.data);
    } catch (error) {
      console.error('Erro ao obter jogadores:', error);
    }
  };

  const cadastrarJogador = async () => {
    const nivelInt = parseInt(nivel, 10);

    const dadosParaEnviar = JSON.stringify({
      nome,
      nivel: nivelInt,
      goleiro,
      presenca,
    });

    try {
      await axios.post('http://localhost:8989/cadastroJogador', dadosParaEnviar, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      obterJogadores();

      setNome('');
      setNivel('');
      setGoleiro(false);
    } catch (error) {
      console.error('Erro ao cadastrar jogador:', error);
    }
  };

  const sortearJogadores = async () => {
    try {
      const response = await axios.get('http://localhost:8989/formarTimes');
      setTimesSorteados(response.data.times);
    } catch (error) {
      console.error('Erro ao sortear jogadores:', error);
    }
  };

  const handleEditarJogador = async (id) => {
    try {
      const { data } = await axios.get(`http://localhost:8989/jogador/${id}`);

      setJogadorEditando(data.data);

    } catch (error) {
    }

    setEditando(true);
  };

  const handleExcluirJogador = async (id) => {
    try {
      await axios.delete(`http://localhost:8989/deletarJogador/${id}`);
      obterJogadores();
    } catch (error) {
      console.error(`Erro ao excluir jogador com ID ${id}:`, error);
    }
  };

  const handleAtualizarJogador = async () => {
    const nivelInt = parseInt(jogadorEditando.nivel, 10);

    const dadosParaEnviar = JSON.stringify({
      nome: jogadorEditando.nome,
      nivel: nivelInt,
      goleiro: jogadorEditando.goleiro,
      presenca: jogadorEditando.presenca,
    });

    try {
      await axios.put(`http://localhost:8989/atualizarJogador/${jogadorEditando.id}`, dadosParaEnviar, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      obterJogadores();
      setEditando(false);
      setJogadorEditando(null);
    } catch (error) {
      console.error(`Erro ao atualizar jogador com ID ${jogadorEditando.id}:`, error);
    }
  };

  return (
    <div>
      <h1>Gerenciador de Jogadores</h1>

      <form>
        <label>
          Nome:
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
        </label>
        <br />
        <label>
          Nível:
          <input type="number" value={nivel} onChange={(e) => setNivel(e.target.value)} />
        </label>
        <br />
        <label>
          Goleiro:
          <input type="checkbox" checked={goleiro} onChange={() => setGoleiro(!goleiro)} />
        </label>
        <br />
        <label>
          Presença:
          <input type="checkbox" checked={presenca} onChange={() => setPresenca(!presenca)} />
        </label>
        <br />
        <button type="button" onClick={cadastrarJogador}>
          Cadastrar Jogador
        </button>
      </form>

      <button type="button" onClick={sortearJogadores}>
        Sortear Jogadores
      </button>

      <h2>Jogadores Cadastrados:</h2>
      <ul>
        {jogadores.map((jogador) => (
          <li key={jogador.id}>
            {jogador.nome} / Nível {jogador.nivel} / Goleiro {jogador.goleiro === 1 ? 'Sim' : 'Não'} / Presença {jogador.presenca === 1 ? 'Sim' : 'Não'}
            <button type="button" onClick={() => handleEditarJogador(jogador.id)}>
              Editar
            </button>
            <button type="button" onClick={() => handleExcluirJogador(jogador.id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>

      {editando && jogadorEditando && (
        <div>
          <h2>Editar Jogador</h2>
          <form>
            {/* Formulário de edição com os mesmos campos do cadastro */}
            <label>
              Nome:
              <input type="text" value={jogadorEditando.nome} onChange={(e) => setJogadorEditando({ ...jogadorEditando, nome: e.target.value })} />
            </label>
            <br />
            <label>
              Nível:
              <input type="number" value={jogadorEditando.nivel} onChange={(e) => setJogadorEditando({ ...jogadorEditando, nivel: e.target.value })} />
            </label>
            <br />
            <label>
              Goleiro:
              <input type="checkbox" checked={jogadorEditando.goleiro} onChange={() => setJogadorEditando({ ...jogadorEditando, goleiro: !jogadorEditando.goleiro })} />
            </label>
            <br />
            <label>
              Presença:
              <input type="checkbox" checked={jogadorEditando.presenca} onChange={() => setJogadorEditando({ ...jogadorEditando, presenca: !jogadorEditando.presenca })} />
            </label>
            <br />
            <button type="button" onClick={handleAtualizarJogador}>
              Atualizar Jogador
            </button>
          </form>
        </div>
      )}


      <h2>Times Sorteados:</h2>
      <ul>
        {timesSorteados.map((time, index) => (
          <li key={index}>
            <strong>Time {index + 1}:</strong>
            <ul>
              {time.map((jogador) => (
                <li key={jogador.id}>{jogador.nome} / Nivel {jogador.nivel} {jogador.goleiro === 1 ? '/ Goleiro' : ''}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;