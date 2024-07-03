const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
let converter = require('json-2-csv');

const url = 'https://willowtowers.com/blog';
const pages = [url];
for (let i = 2; i <= 7; i++) {
  const page_url = `${url}/page/${i}`;
  pages.push(page_url);
}
const articles = [];
console.log({ pages });

const scrape = async (siteUrl) => {
  const { data } = await axios.get(siteUrl);
  const $ = cheerio.load(data);

  $('article').each((index, element) => {
    const href = $(element).find('h2 > a').attr('href');
    const title = $(element).find('h2 > a').text().trim().replace(/\n|\r/g, '');
    const excerpt = $(element)
      .find('p.post_excerpt')
      .text()
      .trim()
      .replace(/\n|\r/g, '');
    const img_src = $(element).find('div.post_image > a > img').attr('src');

    // Push the article data into the articles array
    articles.push({ href, title, excerpt, img_src });
  });
};

const run = async () => {
  for await (const url of pages) {
    await scrape(url);
  }
  // console.log({ articles });
  await parseToCSV(articles);
};

run().then(() => {
  console.log('finied');
});

const parseToCSV = async (articlesData) => {
  const filePath = 'blog.csv';
  try {
    const csv = await converter.json2csv(articlesData);
    fs.writeFileSync(filePath, csv);
  } catch (error) {
    console.error(error);
  }
};
