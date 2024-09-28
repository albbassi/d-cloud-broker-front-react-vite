import { useState } from "react";

import { Grid } from "@mui/material";

import Banner from "../../components/Header";
import Footer from "../../components/Footer";
import DataGridGenerica from "../../components/DataGridGenerica";
import BtnVoltar from "../../components/BtnVoltar";
import Titulo from "../../components/Titulo";
import MenuPrincipal from "../../components/MenuPrincipal";

import axios from "axios";


function Todos() {
  const [apiChamada, setApiChamada] = useState("clientes");
  const [cnpj, setCnpj] = useState(null);
  const [nrContrato, setNrCtr] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);


  const CapturaLinhaClicada = (params) => {
    if (apiChamada === "clientes" || apiChamada === null) {
      const novaApiChamada = "filtra-contratos";
      const novoCnpj = params.row.cnpj;
      setApiChamada(novaApiChamada);
      setCnpj(novoCnpj);
      setIsButtonDisabled(false);
    } else if (apiChamada === "filtra-contratos") {
      const novoApiChamada = "filtra-itens";
      const novoNrContrato = params.row.nr_contrato;
      setApiChamada(novoApiChamada);
      setNrCtr(novoNrContrato);
      setIsButtonDisabled(false);
    }
  };


const CapturaCelulaClicada = (params) => {
    if (apiChamada === "filtra-itens" ) {
        const id = params.row.id_item
        let userConfirmation = confirm("Você tem certeza de que deseja deletar este item?");
        // Se o usuário confirmou a exclusão
        if(userConfirmation) {

          // Delete o item
          axios.delete(`http://127.0.0.1:5000/filtra-itens?id_item=${id}`)
          .then(response => {

          })
          .catch(error => {
            console.error(error);
          });
        }
      // Se o usuário cancelou a exclusão
      else {
        // Não faça nada
        alert('Operação de exclusão cancelada.');
      }
    }

};


  const CapturaVoltarClick = () => {
    if (apiChamada === "filtra-contratos") {
      setApiChamada("clientes");
      setCnpj(null);
      setNrCtr(null);
      setIsButtonDisabled(true);
    } else if (apiChamada === "filtra-itens") {
      setApiChamada("filtra-contratos");
    }
  };

  return (
    <>
      <Banner />
      <Titulo apiChamada={apiChamada} cnpj={cnpj} nrContrato={nrContrato} />
      <Grid container spacing={1}
        direction="row"
        justifyContent="center"
        alignItems="baseline"  
      >
        <Grid item xs={1}>
          <MenuPrincipal />
          <hr />
          <BtnVoltar
            desabilita={isButtonDisabled}
            onClick={CapturaVoltarClick}
          />
        </Grid>
        <Grid item xs={11}>
          <section style={{ alignContent: "center", paddingTop: "30px" }}>
            <DataGridGenerica
              apiChamada={apiChamada}
              cnpj={cnpj}
              nrContrato={nrContrato}
              onRowClick={CapturaLinhaClicada}
              onCellClick={CapturaCelulaClicada}
            />
          </section>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default Todos;
