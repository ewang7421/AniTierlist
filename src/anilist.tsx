import { assert } from "console";
import type { List, ListEntry } from "./types";
// Here we define our query as a multi-line string
// Storing it in a separate .graphql/.gql file is also possible
let query = `
query ($userName: String) { # Define which variables will be used in the query (id)
  MediaListCollection (userName: $userName, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
    user {
      id
    }
    lists {
      status
      isCustomList
      entries {
        score(format: POINT_10_DECIMAL)
        media {
          id
          idMal
          coverImage {
            large
            medium
          }
          title {
            romaji
          }
        }
      }
    }
  }
}
`;

// Make the HTTP Api request
export async function getList(username: string) {
  // Define our query variables and values that will be used in the query request
  let variables = {
    userName: username,
  };
  // Define the config we'll need for our Api request
  let url = "https://graphql.anilist.co",
    options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };
  try {
    const response = await fetch(url, options);
    const data = await handleResponse(response);
    return handleData(data);
  } catch (error) {
    handleError(error);
    return {} as List;
  }
}

async function handleResponse(response: Response) {
  const json = await response.json();
  return response.ok ? json : Promise.reject(json);
}

function handleData(data: any): List {
  console.log(data);
  let completedList = data.data.MediaListCollection.lists.filter(
    (list: any) => !list.isCustomList && list.status === "COMPLETED"
  )[0];
  console.log(completedList)

  let entries: ListEntry[] = completedList.entries.map((elm: any) => ({
    id: elm.media.id,
    idMal: elm.media.idMal,
    title: elm.media.title.romaji,
    imageUrl: elm.media.coverImage.large,
    score: elm.score,
    tier: 0,
  }));

  console.assert(
    data.data.MediaListCollection.lists.filter(
      (list: any) => !list.isCustomList && list.status === "COMPLETED"
    ).length === 1,
    "There can only be one completed list"
  );
  let ret = { userId: data.data.MediaListCollection.user.id, entries: entries };

  console.log(ret);
  return ret;
}

function handleError(error: any): void {
  alert("Error, check console");
  console.error(error);
}
