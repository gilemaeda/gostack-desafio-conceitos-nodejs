const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


app.get("/repositories", (request, response) => {
/*
 * GET /repositories: Rota que lista todos os repositórios;
*/
  return response.json(repositories);
});


app.post("/repositories", (request, response) => {

    /*
  * POST /repositories: A rota deve receber title, url e techs dentro do corpo da requisição, sendo a URL o link para o github desse repositório.
  */
  const { title, url, techs } = request.body;

  /*
   * Ao cadastrar um novo projeto, ele deve ser armazenado dentro de um objeto
   * no seguinte formato:
   * {
   *    id: "uuid",
   *    title: 'Desafio Node.js',
   *    url: 'http://github.com/...',
   *    techs: ["Node.js", "..."],
   *    likes: 0
   * };
   * 
   * Certifique-se que o ID seja um UUID, e de sempre iniciar os likes como 0.
  */
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  } 

  repositories.push(repository);

  return response.json(repository);

});


/*
 * PUT /repositories/:id:
 * A rota deve alterar apenas
 * o title,
 * a url e
 * as techs
 * do repositório que possua o id IGUAL ao id presente nos parâmetros da rota;
*/
app.put("/repositories/:id", (request, response) => {

  const { title, url, techs } = request.body;
  const { id } = request.params;

  //procurando pelo índice do repositório
  // repositório.id tem q ser igual ao id recebido no request.
  const findRepositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (findRepositoryIndex === -1)
  {
    return response.status(400).json( {error: 'Repository does not exists'});
  }


  const repository =
  {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepositoryIndex].likes,
  };
  repositories[findRepositoryIndex] = repository

  return response.json(repository);

});


/*
 * DELETE /repositories/:id:
 * A rota deve deletar o repositório com o id presente nos parâmetros da rota;
*/
app.delete("/repositories/:id", (request, response) => {

  const { id } = request.params;

  //procurando pelo índice do repositório
  // repositório.id tem q ser igual ao id recebido no request.
  const findRepositoryIndex = repositories.findIndex(repository => repository.id === id);

  //se o id for encontrado
  if (findRepositoryIndex >= 0){
    //o Método Splice fará a ação de remover o repositório.
    repositories.splice(findRepositoryIndex, 1);
  }

    //se o id não for encontrado.
  else {
  
    return response.status(400).json ({ error: 'Repository does not exists. '});
  }

  /*
   * Para que esse teste passe, você deve permitir que a sua rota de delete exclua um projeto,
   * e ao fazer a exclusão, ele retorne uma resposta vazia, com status 204.
  */

  return response.status(204).send();
});


app.post("/repositories/:id/like", (request, response) => {

  const { id } = request.params;
  //procurando pelo índice do repositório
  // repositório.id tem q ser igual ao id recebido no request.
  const findRepositoryIndex = repositories.findIndex(repository => repository.id === id);

  /*
   * should not be able to like a repository that does not exist:
   * Para que esse teste passe, você deve validar na sua rota de like se o id do repositório enviado pela url existe ou não.
   * Caso não exista, retornar um erro com status 400.
  */
  if (findRepositoryIndex === -1)
  {
    return response.status(400).json( {error: 'Repository does not exists'});
  }

  repositories[findRepositoryIndex].likes++;

  return response.json(repositories[findRepositoryIndex]);
});

module.exports = app;