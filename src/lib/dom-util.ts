export const get: (s: string) => HTMLElement = document.querySelector.bind(document);
export const getAll: (s: string) => NodeListOf<HTMLElement> = document.querySelectorAll.bind(document);
