//@deno-types="npm:@types/jsdom"
import { JSDOM } from "npm:jsdom";

export const normalizeURL = (url: string): string => {
  const urlObject = new URL(url);

  const path: string =
    `${urlObject.hostname}${urlObject.pathname.toLowerCase()}`;

  if (path.length > 0 && path.slice(-1) === "/") {
    return path.slice(0, -1);
  }

  return path;
};

export const urlsFromHTML = (htmlBody: string, url: string) => {
  const urls: string[] = [];
  const dom = new JSDOM(htmlBody);

  const links = dom.window.document.querySelectorAll("a");

  for (const link of links) {
    if (link.href.slice(0, 1) === "/") {
      try {
        const urlObject = new URL(`${url}${link.href}`);
        urls.push(urlObject.href);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(`relative url error: ${error.message}`);
        } else {
          console.log(`Unknow error`);
        }
      }
    } else {
      try {
        const urlObject = new URL(link.href);
        urls.push(urlObject.href);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(`relative url error: ${error.message}`);
        } else {
          console.log(`Unknow error`);
        }
      }
    }
  }
  return urls;
};

export const crawlPage = async (
  baseURL: string,
  currentURL: string,
  pages: Map<string, number>,
): Promise<Map<string, number>> => {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);

  if (baseURLObj.host !== currentURLObj.hostname) {
    return pages;
  }

  const normalizeCurrentURL = normalizeURL(currentURL);
  if ((pages.get(normalizeCurrentURL) ?? 0) > 0) {
    pages.set(normalizeCurrentURL, pages.get(normalizeCurrentURL)! + 1);
    return pages;
  }

  pages.set(normalizeCurrentURL, 1);

  console.log(`currently crawling: ${currentURL}`);

  try {
    const response = await fetch(currentURL);

    if (response.status > 399) {
      console.log(
        `Error in fetch with code: ${response.status} on page ${currentURL}`,
      );
      return pages;
    }

    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("text/html")) {
      console.log(
        `Returned a non html response, content type: ${contentType}, on page: ${currentURL}`,
      );
      return pages;
    }

    const html = await response.text();

    const succeedingURLs = urlsFromHTML(html, baseURL);

    for (const url of succeedingURLs) {
      pages = await crawlPage(baseURL, url, pages);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`Fetch error: ${error.message}, on page: ${currentURL}`);
    } else {
      console.log(`Unknow error`);
    }
  }

  return pages;
};
