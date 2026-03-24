
export default function useBrandTheme() {
  const brandThemes: {
    "primary-dark": string;
    "primary-light": string;
    "sec-dark": string;
    "sec-light": string;
    "surface-light": string;
    "surface-dark": string;
    "button-1": string;
    "button-2": string;
    "warn": string;
    "error": string;
    "highlight":string
  }  = {
   "primary-dark": "#1C1A17",
   "primary-light": "#FAF8F0",
   "sec-dark": "#F5F0DA",
    "sec-light": "#2D2926",
    "surface-light": "#E6D9C0",
    "surface-dark": "#2D2926",
    "button-1": "#6A7DC0",
    "button-2": "#3A5DAE",
    "warn": "#CBA052",
    "error": "#E03C31",
    "highlight": "#EED484",

  } 
  return {brandThemes}
}
