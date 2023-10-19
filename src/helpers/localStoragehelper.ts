export const storeToken = (token: string) => {
  localStorage.setItem("authorization", token);
};
