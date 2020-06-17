import React, { useState, useEffect } from "react";

import "./styles.css";
import api from "./services/api";
import { FiThumbsUp } from 'react-icons/fi'

function App() {

  const [repos, setRepos] = useState([]);
  const [newRepoTitle, setNewRepoTitle] = useState('');

  useEffect(() => {
    api.get('/repositories').then(response => {
      setRepos(response.data);
    });
  }, [])

  async function handleAddRepository() {
    const newRepo = {
      title: newRepoTitle,
      url: "https://github.com/Rocketseat/bootcamp-gostack-desafios/tree/master/desafio-conceitos-nodejs",
      techs: ["ReactJS", "NodeJS", "ReactNative"]
    }

    api.post('/repositories', newRepo).then(response => {
      setRepos([...repos, response.data])
    })
  }

  async function handleRemoveRepository(id) {
    const deletedRepoIndex = repos.findIndex(repo => repo.id === id);
    repos.splice(deletedRepoIndex, 1);
    api.delete(`/repositories/${id}`).then(
      setRepos([...repos])
    )
  }

  function handleInputChange(event) {
    const { value } = event.target;
    setNewRepoTitle(value);
  }

  function handleLike(id) {
    const likedRepoIndex = repos.findIndex(repo => repo.id === id);

    api.post(`/repositories/${id}/like`).then(response => {
      repos[likedRepoIndex].likes = response.data.likes;
      setRepos([...repos])
    })
  }

  return (

    <>
      <div className="container">
        <div>
          <input
            name="inputRepo"
            type="text"
            placeholder="Título do repositório"
            onChange={handleInputChange} />
          <button id="adicionar" onClick={handleAddRepository}>Adicionar</button>

        </div>

        <ul data-testid="repository-list">

          {repos.map(repo => (
            <li key={repo.id}>
              <p>{repo.title}</p>

              <button id="like" onClick={() => handleLike(repo.id)}><span>{<FiThumbsUp />}</span> {repo.likes}</button>
              <button onClick={() => handleRemoveRepository(repo.id)}>Remover</button>
            </li>

          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
