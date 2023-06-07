const THEMEKEY = 'theme'

export function setTheme(theme: string) {
  localStorage.setItem(THEMEKEY, theme)
}

export function getTheme() {
  return localStorage.getItem(THEMEKEY)
}

export function clearTheme() {
  localStorage.removeItem(THEMEKEY)
}
