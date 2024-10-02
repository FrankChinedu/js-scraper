const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
let converter = require('json-2-csv');

const url = 'https://www.amazee.io/blog/page';
const pages = [];
for (let i = 1; i <= 9; i++) {
  const page_url = `${url}/${i}`;
  pages.push(page_url);
}
const articles = [];
console.log({ pages });

const scrape = async (siteUrl) => {
  const { data } = await axios.get(siteUrl);
  const $ = cheerio.load(data);

  $('a.blog-post-listing-post').each((index, element) => {
    const author = $(element).find('div.author__name').text().trim();
    const date = $(element).find('div.author__date').first().text().trim();
    const title = $(element).find('h4.post__title').text().trim();
    const summary = $(element).find('p.post__summary').text().trim();
    const link = $(element).attr('href');
    // Push the article data into the articles array
    articles.push({ author, date, title, summary, link });
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
  const filePath = 'aio-blog.csv';
  try {
    const csv = await converter.json2csv(articlesData);
    fs.writeFileSync(filePath, csv);
  } catch (error) {
    console.error(error);
  }
};
