let githubQuery = (pageCount, queryString) => {
  return {
    query: `
    {
        viewer {
            name
        }
        search(query: "${queryString} user:wabualela sort:updated-desc", type: REPOSITORY, first: ${pageCount}) {
            repositoryCount
            nodes {
                ... on Repository {
                    name
                    description
                    id
                    url
                    viewerSubscription
                    licenseInfo {
                        spdxId
                    }
                }
            }
        }
    }
    `,
  };
};

export default githubQuery;
