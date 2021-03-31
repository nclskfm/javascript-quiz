export function getCookie(key) {
  return document.cookie
    .split('; ')
    ?.find((row) => row.startsWith(key + '='))
    ?.split('=')[1];
}

export function setCookie(key, value, expiration) {
  if (key === 'cookiesAllowed' || getCookie('cookiesAllowed') || expiration) {
    if (!expiration) {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      expiration = date.toGMTString();
    }
    document.cookie =
      key +
      '=' +
      JSON.stringify(value) +
      '; expires=' +
      expiration +
      '; path=/';
  }
}

export function removeAllCookies() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  let cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++)
    setCookie(cookies[i].split('=')[0], null, date.toGMTString());
}
