import React, { useCallback, useEffect, useState } from "react";
import query from "./Query";
import github from "./db";
import RepoInfo from "./components/RepoInfo";

function App() {
  let [userName, setUserName] = useState(null);
  let [repolist, setRepolist] = useState(null);
  let [pageCount, setPageCount] = useState(10);
  let [queryString, setQueryString] = useState("slides");
  let [totalCount, setTotalCount] = useState(null);

  let fetchData = useCallback(() => {
    let queryText = JSON.stringify(query(pageCount, queryString));

    fetch(github.baseURL, {
      method: "POST",
      headers: github.headers,
      body: queryText,
    })
      .then((response) => response.json())
      .then((data) => {
        let viewer = data.data.viewer;
        let repos = data.data.search.nodes;
        let total = data.data.search.respositoryCount;
        setUserName(viewer.name);
        setRepolist(repos);
        setTotalCount(total);
      })

      .catch((err) => {
        console.log(err);
      });
  }, [pageCount, queryString]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <main className="container mt-5">
      <h1 className="text-primary text-center text-capitalize">
        <i className="bi bi-diagram-2-fill"></i>Repos
      </h1>
      <p>Hello there {userName},</p>
      <p>
        <b>Search for:</b>{queryString} | <b>Items per page:</b>{pageCount} | <b>Total results:</b>{totalCount}
      </p>
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
