// ==================== COMMON ====================

async function fetchGraphQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
  return await result.json();
}

// ==================== USER ====================
// check new user
export async function isNewUser(issuer, token) {
  const userQueryDoc = `
  query isUserExist($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      id
      email
      issuer
    }
  }
`;
  // fetch User
  const response = await fetchGraphQL(
    userQueryDoc,
    "isUserExist",
    { issuer },
    token
  );
  return response.data?.users?.length === 0 ? true : false;
}

// createNewUser
export async function createNewUser(metadata, token) {
  const { email, issuer, publicAddress } = metadata;
  const createNewUserDoc = `
  mutation insertNewUser($email: String!, $issuer: String!, $publicAddress: String!, ) {
    insert_users(objects: {
      email: $email,
      issuer: $issuer, 
      publicAddress: $publicAddress
    }) {
      returning {
        email
        id
        issuer
        publicAddress
      }
    }
  }
  `;

  // fetch User
  const response = await fetchGraphQL(
    createNewUserDoc,
    "insertNewUser",
    { email, issuer, publicAddress },
    token
  );
  return response;
}

// find video id by user
export async function findVideoIdByUser(userId, videoId, token) {
  const findVideoByUserDoc = `
  query findVideoIdByUserId($userId: String!, $videoId: String!) {
    stats(where: { userId: {_eq: $userId}, videoId: {_eq: $videoId }}) {
      id
      userId
      videoId
      favourited
      watched
    }
  }
`;

  // fetch User
  const response = await fetchGraphQL(
    findVideoByUserDoc,
    "findVideoIdByUserId",
    { userId, videoId },
    token
  );

  return response;
}

// ==================== USER ====================

// ==================== STATS ====================

// insert stats
export async function insertStatsByVideoId(
  { favourited, userId, watched, videoId },
  token
) {
  const insertStatsByVideoIdDoc = `
  mutation insertStats($favourited: Int!, $userId: 
  String!, $watched: Boolean!, $videoId: String!) {
    insert_stats_one(object: {favourited: $favourited, 
    userId: $userId, watched: $watched, videoId: $videoId}
    ) {
      favourited
      id
      userId
    }
  }
`;

  const response = await fetchGraphQL(
    insertStatsByVideoIdDoc,
    "insertStats",
    { favourited, userId, watched, videoId },
    token
  );

  return response;
}

// update stats
export async function updateStatsByVideoId(
  { favourited, userId, watched, videoId },
  token
) {
  const updateStatsDoc = `
mutation updateStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
  update_stats(
    _set: {watched: $watched, favourited: $favourited}, 
    where: {
      userId: {_eq: $userId}, 
      videoId: {_eq: $videoId}
    }) {
    returning {
      favourited,
      userId,
      watched,
      videoId
    }
  }
}
`;

  const response = await fetchGraphQL(
    updateStatsDoc,
    "updateStats",
    { favourited, userId, watched, videoId },
    token
  );

  return response;
}

// watch it again video ( watched = true)
export async function getWatchedVideos(userId, token) {
  const getWatchedVideoDoc = `
  query getWatchedVideo($userId: String!) {
    stats(where: {watched: {_eq: true}, userId: {_eq: $userId}}) {
      videoId
      watched
    }
  }
`;

  try {
    const response = await fetchGraphQL(
      getWatchedVideoDoc,
      "getWatchedVideo",
      { userId },
      token
    );
    return response?.data?.stats;
  } catch (err) {
    console.error("getWatchedVideo err", { err });
  }
}

export async function getMyListVideos(userId, token) {
  const operationsDoc = `
  query favouritedVideos($userId: String!) {
    stats(where: {
      userId: {_eq: $userId}, 
      favourited: {_eq: 1}
    }) {
      videoId
    }
  }
`;

  const response = await fetchGraphQL(
    operationsDoc,
    "favouritedVideos",
    {
      userId,
    },
    token
  );

  return response?.data?.stats;
}

// ==================== STATS ====================
