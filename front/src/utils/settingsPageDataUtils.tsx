function setCurrentSettingsPage(page: number) {
  sessionStorage.setItem("settingsPage", page.toString());
}

function getCurrentSettingsPage() {
  let page = sessionStorage.getItem("settingsPage");
  if (!page) {
    page = "1";
  }
  return Number(page);
}

function setCurrentSettingsPageLimit(limit: number) {
  sessionStorage.setItem("settingsPageLimit", limit.toString());
}

function getCurrentSettingsPageLimit() {
  let limit = sessionStorage.getItem("settingsPageLimit");
  if (!limit) {
    limit = "10";
  }
  return Number(limit);
}

function setCurrentSettingsSearch(input: string) {
  sessionStorage.setItem("settingsSearch", input);
}

function getCurrentSettingsSearch() {
  let search = sessionStorage.getItem("settingsSearch");
  if (!search) {
    search = "";
  }
  return search; 
}

export {
  getCurrentSettingsPage,
  getCurrentSettingsPageLimit,
  setCurrentSettingsPage,
  setCurrentSettingsPageLimit,
  getCurrentSettingsSearch, 
  setCurrentSettingsSearch
};
