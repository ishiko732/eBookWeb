const copy = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

export default copy;
