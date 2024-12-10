import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { positionAfterProtocol } from "./helpers/stringHelpers.ts";
import { normalizeURL, urlsFromHTML } from "../crawl.ts";

describe("normalize the url", () => {
  const mockURL = "https://calendar.mcpl.info/events";
  const mockTrailingSlash = "https://calendar.mcpl.info/events/";
  const mockCapitals = "https://Calendar.mcPl.info/evENts";
  it("strips the protocol", () => {
    const output = normalizeURL(mockURL);
    const protocolEnd = positionAfterProtocol(mockURL);
    const expectedOutput = mockURL.substring(protocolEnd);
    expect(output).toEqual(expectedOutput);
  });

  it("removes the trailing slash", () => {
    const output = normalizeURL(mockTrailingSlash);
    const protocolEnd = positionAfterProtocol(mockTrailingSlash);
    const expectedOutput = mockTrailingSlash.substring(
      protocolEnd,
      mockTrailingSlash.length - 1,
    );
    expect(output).toEqual(expectedOutput);
  });

  it("reduces all characters to lowercase", () => {
    const output = normalizeURL(mockCapitals);
    const protocolEnd = positionAfterProtocol(mockCapitals);
    const expectedOutput = mockCapitals.substring(protocolEnd)
      .toLocaleLowerCase();
    expect(output).toEqual(expectedOutput);
  });
});

describe("retrieves urls from HTML", () => {
  const mockAbsoluteURL = "https://calendar.mcpl.info/events";
  const secondMockAbsoluteURL = "https://mcpl.info/geninfo/hours-and-locations";
  const mockRelativeURL = "/events/";
  it("retrieves absolute urls from html", () => {
    const mockHTML = `
    <html>
        <body>
            <a href="${mockAbsoluteURL}">
                events
            </a>
            <a href="${secondMockAbsoluteURL}">
                location
            </a>
        </body>
    <html>
    `;
    const url = "https://calendar.mcpl.info";
    const output = urlsFromHTML(mockHTML, url);
    const expectedOutput = [mockAbsoluteURL, secondMockAbsoluteURL];
    expect(output).toEqual(expectedOutput);
  });
  it("retrieves relative urls from html", () => {
    const mockHTML = `
    <html>
        <body>
            <a href="${mockRelativeURL}">
                events
            </a>
        </body>
    <html>
    `;
    const url = "https://calendar.mcpl.info";
    const output = urlsFromHTML(mockHTML, url);
    const expectedOutput = [`${url}${mockRelativeURL}`];
    expect(output).toEqual(expectedOutput);
  });

  it("retrieves both absolute and relative urls", () => {
    const mockHTML = `
    <html>
        <body>
            <a href="${mockRelativeURL}">
                events
            </a>
            <a href="${secondMockAbsoluteURL}">
                location
            </a>
        </body>
    <html>
    `;
    const url = "https://calendar.mcpl.info";
    const output = urlsFromHTML(mockHTML, url);
    const expectedOutput = [`${url}${mockRelativeURL}`, secondMockAbsoluteURL];
    expect(output).toEqual(expectedOutput);
  });
  it("returns no url if invalid url is given", () => {
    const mockHTML = `
    <html>
        <body>
            <a href="invalid">
                events
            </a>
        </body>
    <html>
    `;
    const url = "https://calendar.mcpl.info";
    const output = urlsFromHTML(mockHTML, url);
    const expectedOutput: [] = [];
    expect(output).toEqual(expectedOutput);
  });
});
