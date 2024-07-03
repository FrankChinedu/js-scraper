const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://unitedhebrewgeriatric.org/category/all';
const pages = [url];
console.log('mme');
for (let i = 2; i <= 13; i++) {
  const page_url = `${url}/page/${i}`;
  pages.push(page_url);
}
const scrape = async () => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const articles = [];

  $('article').each((index, element) => {
    const href = $(element).find('h2 > a').attr('href');
    const title = $(element).find('h2 > a').text();
    const excerpt = $(element).find('div.entry-content > p').text();
    const time = $(element)
      .find('footer.entry-footer > span.posted-on > a > time')
      .first()
      .text();
    const category = $(element)
      .find('footer.entry-footer > span.cat-links > a')
      .contents()
      .map(function (i, el) {
        // this === el
        return $(this).text();
      })
      .toArray()
      .join(', ');
    // Push the article data into the articles array
    articles.push({ href, title, excerpt, time, category });
  });
  console.log({ articles });
};

scrape();
