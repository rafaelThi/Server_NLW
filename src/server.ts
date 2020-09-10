import express from 'express';
import routes from './routes';
import cors from 'cors';

const app = express();
app.use(cors());        
app.use(express.json());
app.use(routes);

app.listen(3333);

//GET: Buscar ou listar informacoes
//POST: Criar alguma nova Informacao
//PUT: Atualizar uma informacao existente
//DELETE: Deletar uma informacao

//Corpo (request body): dados para criaçao, ou atualizacao de um registro
//Routs Params: identificar qual recurso att ou delet 
//Query Params: Paginacao, filtro, ordenacao    


//localhost:3333
