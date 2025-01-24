export const generateRandomString = (
  length: number,
  isNumeric: boolean = false,
  isCharacter: boolean = false,
): string => {
  let characters = '';

  if (!(isNumeric && !isCharacter)) {
    for (let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); ++i) {
      characters += String.fromCharCode(i);
    }
    for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); ++i) {
      characters += String.fromCharCode(i);
    }
  }

  if (!(isCharacter && !isNumeric)) {
    for (let i = '0'.charCodeAt(0); i <= '9'.charCodeAt(0); ++i) {
      characters += String.fromCharCode(i);
    }
  }

  const charactersLength = characters.length;
  let result = '';
  for (let i = 0; i < length; ++i) {
    result += characters[Math.floor(Math.random() * charactersLength)];
  }
  return result;
};
