import { useForm } from "react-hook-form";

import { useEffect } from "react";

import axios from "axios";

import BtnCancel from "./BtnCancel";
import BtnCadastrar from "./BtnCadastrar";
import "./FormGeral.css";

export default function FormCliente() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setFocus,
    formState: { errors },
    formState: { isSubmitSuccessful },
  } = useForm();

  const cnpjValue = watch("cnpj", "");


  const formataCnpj = (value) => {
    return value
      .replace(/\D/g, "") // Remove não dígitos
      .replace(/(\d{2})(\d)/, "$1.$2") // insere ponto após os dois primeiros dígitos
      .replace(/(\d{3})(\d)/, "$1.$2") // insere ponto após os três dígitos seguintes
      .replace(/(\d{3})(\d)/, "$1/$2") // insere barra após os três dígitos seguintes
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2"); // insere hífen antes dos últimos dois dígitos
  };


  const buscaEndereco = async (e) => {
    const cep = e.target.value.replace(/\D/g,'') ;
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      // Handle the response data
      setValue('localizacao', response.data.logradouro);
      setValue('bairro', response.data.bairro);
      setValue('localidade', response.data.localidade);
      setValue('uf', response.data.uf);
      setValue('estado', response.data.estado);
      setFocus('numero');
  
    } catch (error) {
      // Handle any errors
      console.error('Error fetching data:', error);
    }
  };

  const handleCNPJChange = (event) => {
    const formatadoCnpj = formataCnpj(event.target.value);
    setValue("cnpj", formatadoCnpj);
  };


  const onSubmit = (data) => {
    const form = new FormData();
    form.append("cnpj", data.cnpj);
    form.append("nome", data.nome);
    form.append("localizacao", data.localizacao);
    form.append("cep", data.cep);
    form.append("numero", data.numero);
    form.append("complemento", data.complemento);
    form.append("bairro", data.bairro);
    form.append("localidade" , data.localidade);
    form.append("uf", data.uf);
    form.append("estado", data.estado);


    axios
      .post("http://127.0.0.1:5000/cliente", form)
      .then((data) => {
        if (data.statusText === "OK") {
          alert("Parabéns, dados inseridos com sucesso!");
        }
      })
      .catch((error) => {
        alert(("Erro na solicitação POST:", error));
      });
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ nome: ""
            , cnpj: ""
            , localizacao: ""
            , cep:""
            , numero:""
            , complemento:""
            , bairro:""
            , localidade:""
            , uf:""
            , estado:"" });
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <label>Cliente:</label>
      <input
        placeholder="Preencha o nome do cliente"
        {...register("nome", { required: true })}
      />
      {errors.nome && <p className="pmensagem">Campo Obrigatório!</p>}
      <label>CNPJ:</label>
      <input
        placeholder="Preencha o CNPJ do cliente"
        {...register("cnpj", { required: true })}
        value={cnpjValue}
        onChange={handleCNPJChange}
      />
      {errors.cnpj && <p className="pmensagem">Campo Obrigatório!</p>}
      <label>CEP</label>
      <input
        placeholder="Preencha o CEP do cliente"
        {...register("cep", { required: true })}
        onBlur={buscaEndereco}
      />
      <label>Logradouro</label>
      {errors.localizacao && <p className="pmensagem">Campo Obrigatório!</p>}
      <input
        placeholder=""
        {...register("localizacao", { required: true })}
      />
      {/* ESTOU AQUI*/}

      <label>Número</label>
      {errors.numero && <p className="pmensagem">Campo Obrigatório!</p>}
      <input
        placeholder="Preencha o número"
        {...register("numero", { required: true })}
      />

      <label>Complemento</label>
      {errors.complemento && <p className="pmensagem">Campo Obrigatório!</p>}
      <input
        placeholder="Preencha o complemento"
        {...register("complemento", { required: true })}
      />

      <label>Bairro</label>
      {errors.bairro && <p className="pmensagem">Campo Obrigatório!</p>}
      <input
        placeholder=""
        {...register("bairro", { required: true })}
      />

      <label>Localidade</label>
      {errors.localidade && <p className="pmensagem">Campo Obrigatório!</p>}
      <input
        placeholder=""
        {...register("localidade", { required: true })}
      />

      <label>UF</label>
      {errors.uf && <p className="pmensagem">Campo Obrigatório!</p>}
      <input
        placeholder=""
        {...register("uf", { required: true })}
      />

      <label>Estado</label>
      {errors.estado && <p className="pmensagem">Campo Obrigatório!</p>}
      <input
        placeholder=""
        {...register("estado", { required: true })}
      />


      {/*  Terminei aqui*/}
      <BtnCadastrar
        sx={{
          width: 1000,
          color: "success.main",
          "& .MuiSlider-thumb": {
            borderRadius: "1px",
          },
        }}
      />
      <BtnCancel
        sx={{
          width: 1000,
          color: "error.main",
          "& .MuiSlider-thumb": {
            borderRadius: "1px",
          },
        }}
      />
    </form>
  );
}
