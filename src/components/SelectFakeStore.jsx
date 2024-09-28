import { useState, useEffect } from "react";
import axios from "axios";
import { Select, MenuItem, FormControl } from "@mui/material";
import PropTypes from "prop-types";

const SelectFakeStore = ({ onChange }) => {
  // Variável que vai guardar o array com os produtos
  const [opcoes, setOpcoes] = useState([]);
  // Variável que vai guardar os valores de estado do carregamento dos produtos
  const [carregando, setCarregando] = useState(true);
  // Variável que vai guardar o status de erro
  const [error, setError] = useState(null);
  // Variável que vai guardar a escolha do select para o cliente
  const [escolha, setEscolha] = useState("");

  // Hook do React que permite sincronizar um componente com dados de sistemas externos
  // Está sendo executado para pegar os dados de cliente
  useEffect(() => {
    // Função para coletar os clientes e alimentar o select de clientes do formulário contratos
    const AlimentaFakeStore = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        const data = response.data;
        const arrayData = data;
        if (Array.isArray(arrayData)) {
          setOpcoes(arrayData);
        } else {
          console.error("A resposta da API não é um ARRAY");
          setError("Formato de resposta desconhecido");
        }
      } catch (error) {
        console.error("Erro no fetching dos dados", error);
        setError("Erro ao fazer o fetching dos dados");
      } finally {
        setCarregando(false);
      }
    };

    AlimentaFakeStore();
  }, []);

  // Pega o valor do id_cliente selecionado
  const handleChange = (event) => {
    const value = event.target.value;
    setEscolha(value);
    // Função que será passada para o form contrato para carregar a chave do cliente
    if (onChange) {
      onChange(value);
    }
  };

  if (carregando) {
    return <div>Carregando os dados ...</div>;
  }

  if (error) {
    return <div>Erro, favor verificar: {error}</div>;
  }

  return (
    <FormControl fullWidth>
      <label>Produto:</label>
      <Select
        id="select-produto"
        // Valor escolhido que será passado para o formulário
        value={escolha}
        onChange={handleChange}
      >
        {opcoes.map((opcao) => (
          <MenuItem key={opcao.id} value={opcao}>
            {opcao.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

SelectFakeStore.propTypes = {
  onChange: PropTypes.func,
};

export default SelectFakeStore;
