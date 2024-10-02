const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
let converter = require('json-2-csv');

const url = 'https://unitedhebrewgeriatric.org/blog';
const pages = [url];
for (let i = 2; i <= 18; i++) {
  const page_url = `${url}/page/${i}`;
  pages.push(page_url);
}
const articles = [];
console.log({ pages });

const scrape = async (siteUrl) => {
  const { data } = await axios.get(siteUrl);
  const $ = cheerio.load(data);

  $('article').each((index, element) => {
    const href = $(element).find('h3 > a').attr('href');
    const title = $(element).find('h3 > a').text().trim().replace(/\n|\r/g, '');
    const excerpt = $(element)
      .find('div.elementor-post__excerpt > p')
      .text()
      .trim()
      .replace(/\n|\r/g, '');
    const img_src = $(element)
      .find('a > div.elementor-post__thumbnail > img')
      .attr('src');

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
  const filePath = 'uhgcblog.csv';
  try {
    const csv = await converter.json2csv(articlesData);
    fs.writeFileSync(filePath, csv);
  } catch (error) {
    console.error(error);
  }
};
