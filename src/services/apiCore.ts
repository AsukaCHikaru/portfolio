export const request = async (pathname: string) => {
  const response = await fetch("http://localhost:3000" + pathname);
  return response.json();
};
