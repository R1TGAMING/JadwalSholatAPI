const axios = require("axios")
const cheerio = require("cheerio")
const express = require("express")
const JSON = require("json")

const app = express()

app.get("/", (req, res) => {

  axios.get("https://www.jadwalsholat.org/").then(response => {
    const data = []
    const $ = cheerio.load(response.data)
    const table = $("div.widget-area")
    const waktu = table.find("iframe").attr("data-src")
    axios.get(waktu).then(response2 => {
      const $ = cheerio.load(response2.data)
    res.
    res.json(response2.data)
    })
    
    
  })
  
})

app.listen(8000, () => {
  console.log("Server started on port 8000")
})