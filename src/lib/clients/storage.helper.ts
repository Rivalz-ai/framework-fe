const isClient = typeof window !== "undefined";

export const setAccessTokenToLocal = (token: string) => {
  if (isClient) {
    localStorage.setItem("accessToken", token);
  }
};

export const getAccessTokenFromLocal = () => {
  if (isClient) {
    return localStorage.getItem("accessToken");
  }
  return "";
};

export const setProjectSelectedToLocal = (project_id: string) => {
  if (isClient) {
    localStorage.setItem("projectSelected", project_id);
  }
};

export const getProjectSelectedFromLocal = () => {
  if (isClient) {
    return localStorage.getItem("projectSelected");
  }
  return "";
};

export const deleteAccessTokenFromLocal = () => {
  if (isClient) {
    localStorage.removeItem("accessToken");
  }
};

export const deleteTwitterInfoFromLocal = () => {
  if (isClient) {
    localStorage.removeItem("twitter");
  }
};

export const getAccessTokenFromCookie = () => {
  if (isClient) {
    const cookies = document.cookie.split(";");
    console.log(cookies);

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith("accessToken=")) {
        return cookie.substring("accessToken=".length, cookie.length);
      }
    }
  }
};
