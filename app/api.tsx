const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;

export async function searchSite(
  pageNum: number,
  pageSize: number,
  query?: string,
  lang?: string,
  sortField?: string,
  categoryId?: number
) {
  const bodyObject: any = {
    pageNum: pageNum,
    pageSize: pageSize ? pageSize : 10,
  };

  if (query) {
    bodyObject.query = query;
  }

  if (lang) {
    bodyObject.lang = lang;
  }

  if (sortField != "relevance") {
    bodyObject.sortField = sortField;
  }

  if (categoryId) {
    bodyObject.categoryIds = [categoryId] as number[];
  }

  const url = `${API_HOST}${API_PREFIX}/search`;
  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyObject),
    next: { revalidate: 10 },
  });

  if (!result.ok) {
    throw new Error("Failed to fetch data");
  }

  const json = await result.json();
  return json;
}

export async function recommendSite(
  siteId: number,
  lang?: string,
  size?: number
) {
  const bodyObject: any = {
    id: siteId,
  };

  if (lang) {
    bodyObject.lang = lang;
  }

  const url = `${API_HOST}${API_PREFIX}/recommend`;
  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyObject),
    next: { revalidate: 10 },
  });

  if (!result.ok) {
    throw new Error("Failed to fetch data");
  }

  const json = await result.json();
  return json;
}

export async function getCategory(id: number, lang: string) {
  const url = `${API_HOST}${API_PREFIX}/categories/${id}/${lang}`;
  const result = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 10 },
  });

  if (!result.ok) {
    throw new Error("Failed to fetch data");
  }

  const json = await result.json();
  return json;
}

export async function listCategories(lang: string) {
  const url = `${API_HOST}${API_PREFIX}/categories/${lang}`;
  const result = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 10 },
  });

  if (!result.ok) {
    throw new Error("Failed to fetch data");
  }

  const json = await result.json();
  return json;
}

export async function groupCountCategories() {
  const url = `${API_HOST}${API_PREFIX}/categories/group_count`;
  const result = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 10 },
  });

  if (!result.ok) {
    throw new Error("Failed to fetch data");
  }

  const json = await result.json();
  return json;
}

export async function getWebsiteDetail(id: number, lang: string) {
  const url = `${API_HOST}${API_PREFIX}/${id}/${lang}`;

  const result = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 10 },
  });

  if (!result.ok) {
    throw new Error("Failed to fetch data");
  }

  const json = await result.json();
  return json;
}
