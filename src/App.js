import React, { useCallback, useEffect, useState } from "react";
import query from "./Query";
import github from "./db";
import RepoInfo from "./components/RepoInfo";

function App() {
     const [userName, setUserName] = useState(null);
     const [repolist, setRepolist] = useState(null);
     const fetchData = useCallback(() => {
          fetch(github.baseURL, {
               method: "POST",
               headers: github.headers,
               body: JSON.stringify(query),
          })
               .then((response) => response.json())
               .then((data) => {
                    let viewer = data.data.viewer;
                    let repos = data.data.search.nodes;
                    setUserName(viewer.name);
                    setRepolist(repos);
               })
                   
               .catch((err) => {
                    console.log(err);
               });
     }, []);

     useEffect(() => {
          fetchData();
     }, [fetchData]);

     return (
          <main className="container mt-5">
               <h1 className="text-primary text-center text-capitalize">
                    <i className="bi bi-diagram-2-fill"></i>Repos
               </h1>
               <p>Hello there {userName},</p>
               {repolist && (
                    <ul className="list-group list-group-flush">
                         {repolist.map((repo) => (
                              <RepoInfo key={repo.id} repo={repo} />
                         ))}
                    </ul>
               )}
          </main>
     );
}

export default App;
