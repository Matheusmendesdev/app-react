import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [jogadores, setJogadores] = useState([]);
  const [nome, setNome] = useState('');
  const [nivel, setNivel] = useState('');
  const [goleiro, setGoleiro] = useState(false);

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
    try {
      await axios.post('http://localhost:8989/cadastroJogador', {
        nome,
        nivel,
        goleiro,
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
      const response = await axios.get('http://localhost:8989/jogadores');
      console.log('Times sorteados:', response.data.times);
    } catch (error) {
      console.error('Erro ao sortear jogadores:', error);
    }
  };

  return (
    <div>
      <h1>Gerenciador de Jogadoressssss</h1>

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
          <li key={jogador.id}>{jogador.nome} - Nível {jogador.nivel}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;