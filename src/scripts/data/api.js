import { getAccessToken } from '../utils/auth';
import { BASE_URL } from '../config';

const ENDPOINTS = {
  // Auth
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
  // MY_USER_INFO: `${BASE_URL}/users/me`,

  // Story
  REPORT_LIST: `${BASE_URL}/stories`,
  REPORT_DETAIL: (id) => `${BASE_URL}/stories/${id}`,
  STORE_NEW_REPORT: `${BASE_URL}/stories`,

  // Story Comment
  // REPORT_COMMENTS_LIST: (storyId) => `${BASE_URL}/stories/${storyId}/comments`,
  // STORE_NEW_REPORT_COMMENT: (storyId) => `${BASE_URL}/stories/${storyId}/comments`,

  // Story Comment
  SUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  SEND_REPORT_TO_ME: (storyId) => `${BASE_URL}/stories/${storyId}/notify-me`,
  SEND_REPORT_TO_USER: (storyId) => `${BASE_URL}/stories/${storyId}/notify`,
  SEND_REPORT_TO_ALL_USER: (storyId) => `${BASE_URL}/stories/${storyId}/notify-all`,
  // SEND_COMMENT_TO_REPORT_OWNER: (storyId, commentId) =>
  //   `${BASE_URL}/stories/${storyId}/comments/${commentId}/notify`,
};

export async function getRegistered({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getLogin({ email, password }) {
  const data = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

// export async function getMyUserInfo() {
//   const accessToken = getAccessToken();

//   const fetchResponse = await fetch(ENDPOINTS.MY_USER_INFO, {
//     headers: { Authorization: `Bearer ${accessToken}` },
//   });
//   const json = await fetchResponse.json();

//   return {
//     ...json,
//     ok: fetchResponse.ok,
//   };
// }

export async function getAllStories() {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.REPORT_LIST, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getStoryById(id) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.REPORT_DETAIL(id), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function storeNewStory(formData) { // Accept formData directly
  const accessToken = getAccessToken();

  // Remove all the manual formData construction code here

  const fetchResponse = await fetch(ENDPOINTS.STORE_NEW_REPORT, {
    method: 'POST',
    headers: { 
      // REMOVE 'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}` 
    },
    body: formData, // Use the passed formData
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });
 
  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();
 
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
 
export async function unsubscribePushNotification({ endpoint }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({ endpoint });
 
  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();
 
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

// export async function getAllCommentsByStoryId(storyId) {
//   const accessToken = getAccessToken();

//   const fetchResponse = await fetch(ENDPOINTS.REPORT_COMMENTS_LIST(storyId), {
//     headers: { Authorization: `Bearer ${accessToken}` },
//   });
//   const json = await fetchResponse.json();

//   return {
//     ...json,
//     ok: fetchResponse.ok,
//   };
// }

// export async function storeNewCommentByStoryId(storyId, { body }) {
//   const accessToken = getAccessToken();
//   const data = JSON.stringify({ body });

//   const fetchResponse = await fetch(ENDPOINTS.STORE_NEW_REPORT_COMMENT(storyId), {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${accessToken}`,
//     },
//     body: data,
//   });
//   const json = await fetchResponse.json();

//   return {
//     ...json,
//     ok: fetchResponse.ok,
//   };
// }

export async function sendStoryToMeViaNotification(storyId) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.SEND_REPORT_TO_ME(storyId), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function sendStoryToUserViaNotification(storyId, { userId }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({
    userId,
  });

  const fetchResponse = await fetch(ENDPOINTS.SEND_REPORT_TO_USER(storyId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function sendStoryToAllUserViaNotification(storyId) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.SEND_REPORT_TO_ALL_USER(storyId), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

// export async function sendCommentToStoryOwnerViaNotification(storyId, commentId) {
//   const accessToken = getAccessToken();

//   const fetchResponse = await fetch(ENDPOINTS.SEND_COMMENT_TO_REPORT_OWNER(storyId, commentId), {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
//   const json = await fetchResponse.json();

//   return {
//     ...json,
//     ok: fetchResponse.ok,
//   };
// }
