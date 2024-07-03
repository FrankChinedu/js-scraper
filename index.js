const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
let converter = require('json-2-csv');

const url = 'https://unitedhebrewgeriatric.org/category/all';
const pages = [url];
// console.log('mme');
for (let i = 2; i <= 13; i++) {
  const page_url = `${url}/page/${i}`;
  pages.push(page_url);
}
const articles = [];

const scrape = async (siteUrl) => {
  const { data } = await axios.get(siteUrl);
  const $ = cheerio.load(data);

  $('article').each((index, element) => {
    const href = $(element).find('h2 > a').attr('href');
    const title = $(element).find('h2 > a').text();
    const excerpt = $(element).find('div.entry-content > p').text();
    const img_src = $(element)
      .find('figure.post-thumbnail > a > img')
      .attr('src');
    const time = $(element)
      .find('footer.entry-footer > span.posted-on > a > time')
      .first()
      .text();
    const category = $(element)
      .find('footer.entry-footer > span.cat-links > a')
      .contents()
      .map(function () {
        return $(this).text();
      })
      .toArray()
      .join(', ');
    // Push the article data into the articles array
    articles.push({ href, title, excerpt, time, category, img_src });
  });
};

const run = async () => {
  for await (const url of pages) {
    await scrape(url);
  }
  await parseToCSV(articles);
};

run().then(() => {
  console.log('finied');
});

const parseToCSV = async (articlesData) => {
  const filePath = 'articles.csv';
  try {
    const csv = await converter.json2csv(articlesData);
    fs.writeFileSync(filePath, csv);
  } catch (error) {
    console.error(error);
  }
};
