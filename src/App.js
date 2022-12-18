import React, { useCallback, useEffect, useState } from "react";
import query from "./Query";
import github from "./db";
import RepoInfo from "./components/RepoInfo";
import SearchBox from "./SearchBox";
import NavButtons from "./NavButtons";

function App() {
  let [userName, setUserName] = useState(null);
  let [repolist, setRepolist] = useState(null);
  let [pageCount, setPageCount] = useState(10);
  let [queryString, setQueryString] = useState("");
  let [totalCount, setTotalCount] = useState(null);

  let [startCursor, setStartCursor] = useState(null);
  let [endCursor, setEndCursor] = useState(null);
  let [hasNextPage, setHasNextPage] = useState(true);
  let [hasPreviousPage, setHasPreviousPage] = useState(false);
  let [paginationKeyword, setPaginationKeyword] = useState("first");
  let [paginationString, setPaginationString] = useState("");

  let fetchData = useCallback(() => {
    let queryText = JSON.stringify(
      query(pageCount, queryString, paginationKeyword, paginationString)
    );

    fetch(github.baseURL, {
      method: "POST",
      headers: github.headers,
      body: queryText,
    })
      .then((response) => response.json())
      .then((data) => {
        let viewer = data.data.viewer;
        let repos = data.data.search.edges;
        let total = data.data.search.repositoryCount;

        let start = data.data.search.pageInfo?.startCursor;
        let end = data.data.search.pageInfo?.endCursor;
        let next = data.data.search.pageInfo?.hasNextPage;
        let prev = data.data.search.pageInfo?.hasPreviousPage;

        setUserName(viewer.name);
        setRepolist(repos);
        setTotalCount(total);

        setStartCursor(start);
        setEndCursor(end);
        setHasNextPage(next);
        setHasPreviousPage(prev);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageCount, queryString, paginationKeyword, paginationString]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <main className="container mt-5">
      <h1 className="text-primary text-center text-capitalize">
        <i className="bi bi-diagram-2-fill"></i>Repos
      </h1>
      <p>Hello there {userName},</p>
      <SearchBox
        totalCount={totalCount}
        pageCount={pageCount}
        queryString={queryString}
        onTotalChange={(myNumber) => setPageCount(myNumber)}
        onQueryChange={(myString) => setQueryString(myString)}
      />
      <NavButtons
        start={startCursor}
        end={endCursor}
        next={hasNextPage}
        previous={hasPreviousPage}
        onPage={(myKeyword, myString) => {
          setPaginationKeyword(myKeyword);
          setPaginationString(myString);
        }}
      />
      {repolist && (
        <ul className="list-group list-group-flush">
          {repolist.map((repo) => (
            <RepoInfo key={repo.node.id} repo={repo.node} />
          ))}
        </ul>
      )}
      <NavButtons
        start={startCursor}
        end={endCursor}
        next={hasNextPage}
        previous={hasPreviousPage}
        onPage={(myKeyword, myString) => {
          setPaginationKeyword(myKeyword);
          setPaginationString(myString);
        }}
      />
    </main>
  );
}

export default App;
