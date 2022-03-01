const express = require("express");
// request module for http request
const request = require("request");
// cheerio for parsing the markup
const cheerio = require("cheerio");
const app = express();

// middlewares for parsing the data form the url or json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// POST /scrape
app.post("/scrape", (req, res) => {
  const url = req.body.url;
  if (!url) {
    return res.status(404).json({ message: "No url provided" });
  }
  request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      // creating response object
      let output = {};
      const $ = cheerio.load(html);
      const title = $("head title").text();
      const description = $('meta[name="description"]').attr("content");
      const images = $("img");
      const keyword = $('meta[name="keywords"]').attr("content");
      const ogTitle = $('meta[property="og:title"]').attr("content"); //title
      const ogImage = $('meta[property="og:image"]').attr("content"); //image
      const ogkeywords = $('meta[property="og:keywords"]').attr("content"); //keywords
      const ogSitename = $('meta[property="og:site_name"]').attr("content"); //site_name
      const ogDescription = $('meta[property="og:description"]').attr(
        "content"
      ); //description
      const ogUrl = $('meta[property="og:url"]').attr("content"); //url

      if (title) {
        output.title = title;
      }

      if (description) {
        output.description = description;
      }

      if (keyword) {
        output.keyword = keyword;
      }

      if (ogImage && ogImage.length) {
        output.ogImage = ogImage;
      }

      if (ogTitle && ogTitle.length) {
        output.ogTitle = ogTitle;
      }

      if (ogkeywords && ogkeywords.length) {
        output.ogkeywords = ogkeywords;
      }

      if (ogDescription && ogDescription.length) {
        output.ogDescription = ogDescription;
      }
      if (ogSitename && ogSitename.length) {
        output.ogSitename = ogSitename;
      }
      if (ogUrl && ogUrl.length) {
        output.ogUrl = ogUrl;
      }
      if (images && images.length) {
        output.images = [];

        for (var i = 0; i < images.length; i++) {
          output.images.push($(images[i]).attr("src"));
        }
      }

      res.status(200).json(output);
    } else {
      return res.status(500).json({ error: "There was some kind of error" });
    }
  });
});

app.listen(5100, () => console.log("server running on port 5100"));
