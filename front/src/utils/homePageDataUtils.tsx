function setCurrentHomePage(page: number) {
  sessionStorage.setItem("homePage", page.toString());
}

function getCurrentHomePage() {
  let page = sessionStorage.getItem("homePage");
  if (!page) {
    page = "1";
  }
  return Number(page);
}

function setCurrentHomePageLimit(limit: number) {
  sessionStorage.setItem("homePageLimit", limit.toString());
}

function getCurrentHomePageLimit() {
  let limit = sessionStorage.getItem("homePageLimit");
  if (!limit) {
    limit = "10";
  }
  return Number(limit);
}

function setCurrentHomePageFilter(filter: string) {
  sessionStorage.setItem("homePageFilter", filter);
}

function getCurrentHomePageFilter() {
  let filter = sessionStorage.getItem("homePageFilter");
  if (!filter) {
    filter = "all";
  }
  return filter;
}

export {
  setCurrentHomePage,
  getCurrentHomePage,
  setCurrentHomePageLimit,
  getCurrentHomePageLimit,
  setCurrentHomePageFilter,
  getCurrentHomePageFilter,
};
