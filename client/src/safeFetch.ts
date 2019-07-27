export const safeFetch = async <TResponse extends any>(
  url: string
): Promise<TResponse | Error> => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (err) {
    return err;
  }
};
