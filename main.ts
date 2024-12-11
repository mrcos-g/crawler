import { crawlPage } from "./crawl.ts";

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  if (!Deno.args.length) {
    console.log("no arguments provided");
    Deno.exit(1);
  }

  if (Deno.args.length > 1) {
    console.log("To many arguments provided");
    Deno.exit(1);
  }

  const baseUrl = Deno.args[0];
  console.log(`crawl started at ${baseUrl}`);
  const pages = await crawlPage(baseUrl, baseUrl, new Map());

  for (const page of pages.entries()) {
    console.log({ page });
  }
}
