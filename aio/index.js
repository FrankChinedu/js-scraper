const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const converter = require('json-2-csv');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  console.log('here');
  res.send('ok');
});

const articles = [];
app.post('/events', (req, res) => {
  const body = req.body;
  body.forEach((item) => {
    articles.push({
      title: item.title,
      description: item.description.text,
      date: item.postDate,
      link: item.link,
    });
  });
  // console.log({ articles });
  parseToCSV(articles);
  res.send('Successful response.');
});

app.listen(3212, () => console.log('Example app is listening on port 3000.'));

const parseToCSV = async (articlesData) => {
  const filePath = 'aio/csv/events.csv';
  try {
    const csv = await converter.json2csv(articlesData);
    fs.writeFileSync(filePath, csv);
  } catch (error) {
    console.error(error);
  }
};
