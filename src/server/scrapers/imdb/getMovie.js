const puppeteer = require('puppeteer');

const IMDB_URL = (movie_id) => `https://www.imdb.com/title/${movie_id}/`;
const MOVIE_ID = `tt7137846`;

(async () => {
  /* Initiate the Puppeteer browser */
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  /* Go to the IMDB Movie page and wait for it to load */
  await page.goto(IMDB_URL(MOVIE_ID), { waitUntil: 'networkidle0' });

  /* Run javascript inside of the page */
  const data = await page.evaluate(() => {
    const title = document.querySelector('div[class="title_wrapper"] > h1')
      .innerText;
    const timeWatch = document
      .querySelector('div[class="subtext"] > time')
      .innerText.trim();
    const rating = document.querySelector('span[itemprop="ratingValue"]')
      .innerText;
    const ratingCount = document.querySelector('span[itemprop="ratingCount"]')
      .innerText;

    let genra = [];
    const genras = document.querySelectorAll('.subtext > a');
    [...genras].forEach((el) => {
      genra.push(el.innerText);
    });
    const releaseDate = [...genra].pop();
    genra = genra.slice(0, genra.length - 1);
    const shortStory = document
      .querySelector(
        '#title-overview-widget > div.plot_summary_wrapper.localized > div.plot_summary > div.summary_text.ready > div > div.plot-text'
      )
      .innerText.trim();
    const director = document.querySelector(
      '#title-overview-widget > div.plot_summary_wrapper.localized > div.plot_summary > div:nth-child(2) > a'
    ).innerText;

    let writers = [];
    const writer = document.querySelectorAll(
      '#title-overview-widget > div.plot_summary_wrapper.localized > div.plot_summary > div:nth-child(3) > a'
    );
    [...writer].forEach((el) => {
      writers.push(el.innerText);
    });

    let stars = [];
    const star = document.querySelectorAll(
      '#title-overview-widget > div.plot_summary_wrapper.localized > div.plot_summary > div:nth-child(4) > a'
    );
    [...star].forEach((el) => {
      stars.push(el.innerText);
    });
    stars = stars.slice(0, stars.length - 1);

    /* Returning an object filled with the scraped data */
    return {
      title,
      genra,
      director,
      writers,
      stars,
      rating,
      ratingCount,
      timeWatch,
      releaseDate,
      shortStory,
    };
  });

  /* Outputting what we scraped */
  console.log(data);

  await browser.close();
})();
