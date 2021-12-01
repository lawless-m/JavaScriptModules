const urlParams = new URLSearchParams(window.location.search);

export function qs(key) { return urlParams.get(key); }

