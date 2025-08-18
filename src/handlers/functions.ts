import * as moment from 'moment';

const crypto = require('crypto');

export const onlyNumbers = (value: string): string => {
  return `${value}`.replace(/[^0-9]/g, '');
};

export const isCPF = (
  cpf_string: string,
): { full: boolean; status: boolean } => {
  const cpf_treated = cpf_string.replace(/[^\d]+/g, '');

  if (
    cpf_treated.length === 11 &&
    !Array.from(cpf_treated).filter((e) => e !== cpf_treated[0]).length
  ) {
    return { full: true, status: false };
  }

  if (cpf_treated.length !== 11 || !!cpf_treated.match(/(\d)\1{10}/)) {
    return { full: false, status: false };
  }

  const cpf = cpf_treated.split('');

  const validator = cpf
    .filter((digit, index, array) => index >= array.length - 2 && digit)
    .map((el) => +el);

  const toValidate = (pop) =>
    cpf
      .filter((digit, index, array) => index < array.length - pop && digit)
      .map((el) => +el);

  const rest = (count, pop) =>
    ((toValidate(pop).reduce((soma, el, i) => soma + el * (count - i), 0) *
      10) %
      11) %
    10;

  return {
    full: true,
    status: !(rest(10, 2) !== validator[0] || rest(11, 1) !== validator[1]),
  };
};

export const isCNPJ = (
  cnpj_string: string,
): { full: boolean; status: boolean } => {
  if (cnpj_string.length > 18) {
    return { full: true, status: false };
  }

  const digitsOnly = /^\d{14}$/.test(cnpj_string);
  const validFormat = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/.test(cnpj_string);

  if (digitsOnly || validFormat) {
  } else {
    return { full: false, status: false };
  }

  const match = cnpj_string.toString().match(/\d/g);
  const numbers = Array.isArray(match) ? match.map(Number) : [];

  if (numbers.length !== 14) {
    return { full: false, status: false };
  }

  /* @ts-ignore */
  const items = [...new Set(numbers)];

  if (items.length === 1) {
    return { full: true, status: false };
  }

  // Cálculo validador
  const calc = (x) => {
    const slice = numbers.slice(0, x);
    let factor = x - 7;
    let sum = 0;

    for (let i = x; i >= 1; i--) {
      const n = slice[x - i];
      sum += n * factor--;
      if (factor < 2) factor = 9;
    }

    const result = 11 - (sum % 11);

    return result > 9 ? 0 : result;
  };

  const digits = numbers.slice(12);

  const digit0 = calc(12);

  if (digit0 !== digits[0]) {
    return { full: true, status: false };
  }

  const digit1 = calc(13);

  return { full: true, status: digit1 === digits[1] };
};

export const getAge = (dateString: string): number => {
  const start = new Date();
  const end = new Date(dateString);
  return Math.abs(moment.duration(end.getTime() - start.getTime()).years());
};

export const money = (moneyString: string): number => {
  let money = moneyString
    .replaceAll('R$ ', '')
    .replaceAll('.', '')
    .replaceAll(',', '.');
  return parseFloat(money);
};

export const generateReferenceKey = (length: number = 32): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let referenceKey = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referenceKey += characters.charAt(randomIndex);
  }

  return referenceKey;
};

export const futureAmount = (
  initial: number,
  inflation: number,
  years: number,
) => {
  const future = initial * Math.pow(1 + inflation, years);

  return parseFloat(future.toFixed(2));
};

export const PortionAmount = (
  rentability: number,
  months: number,
  futureAmount: number,
) => {
  const bottom = (1 + rentability) * (Math.pow(1 + rentability, months) - 1);
  const top = futureAmount * rentability;
  const portion = top / bottom;

  return parseFloat(portion.toFixed(2));
};

export const convertToSlug = (title: string) => {
  return title
    .toLowerCase() // Convert to lowercase
    .normalize('NFD') // Normalize to decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .trim() // Remove extra spaces
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-'); // Replace multiple hyphens with a single one
};

export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = crypto.randomBytes(1)[0] % 16;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function uuidv7(): string {
  // Get current time in milliseconds since Unix epoch (January 1, 1970)
  const timestamp = Date.now();

  // Split timestamp to represent it in the UUID format
  const timeHex = timestamp.toString(16).padStart(12, '0');
  const randomHex = [...crypto.getRandomValues(new Uint8Array(10))]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Construct the UUID with the timestamp in the correct positions
  return (
    timeHex.substring(0, 8) +
    '-' +
    timeHex.substring(8, 12) +
    '-7' +
    randomHex.substring(0, 3) +
    '-' +
    ((parseInt(randomHex.substring(3, 5), 16) & 0x3f) | 0x80)
      .toString(16)
      .padStart(2, '0') +
    randomHex.substring(5, 8) +
    '-' +
    randomHex.substring(8, 20)
  );
}

export function md5(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex');
}

export function shuffle<T = any>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function validateCode(length: number = 6): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export function generateEmailVerificationToken(length: number = 32): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }
  return token;
}

export function isNumberRegex (value: string): boolean {
  return /^[+-]?\d+(\.\d+)?$/.test(value);
};

/* 
    Function that receive a number (ex: 1, 100, 1000), and verify if the number has less digits than the size variable, and for each missing digit, add a zero at the beginning of the number.
    Ex: num = 100, size = 10000, return 00100
    Ex: num = 1000, size = 10000, return 01000
    Ex: num = 1, size = 10000, return 00001
*/
export function addZeroLeft (num: number, size: number = 1000): string {
  return num.toString().padStart(size.toString().length, '0');
}