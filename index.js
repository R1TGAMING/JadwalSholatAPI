const axios = require("axios")
const cheerio = require("cheerio")
const express = require("express")
const JSON = require("json")

const app = express()

app.get("/kota", (req, res) => {

  axios.get("https://jadwalsholat.org/adzan/ajax.row.php?id=").then(response => {
    const kota = req.query.search
    const $ = cheerio.load(response.data)
    const pilihKota = $("option").filter(function() {
      return $(this).text() == kota
    })
    const value = pilihKota.attr("value")
    if (pilihKota.html()) {
    axios.get("https://jadwalsholat.org/adzan/ajax/ajax.daily1.php?id=" + value).then(response => {
      const $ = cheerio.load(response.data)
      const waktuShubuh = $("tr.table_light").eq(0).find("td").eq(1)
      const waktuDzuhur = $("tr.table_dark").eq(0).find("td").eq(1)
      const waktuAshar = $("tr.table_light").eq(1).find("td").eq(1)
      const waktuMaghrib = $("tr.table_dark").eq(1).find("td").eq(1)
      const waktuIsya = $("tr.table_light").eq(2).find("td").eq(1)
      res.json({
      "kota" : pilihKota.html(),
      "id" : value,
      "waktuSholat" : {
        "shubuh" : waktuShubuh.text(),
        "dzuhur" : waktuDzuhur.text(),
        "ashar" : waktuAshar.text(),
        "mahgrib" : waktuMaghrib.text(),
        "isya" : waktuIsya.text(),
      }     
      })
    })
  } else {
      res.json({
        "Error" : "Kota tidak ditemukan"
      })
  }
  })
})

app.listen(8000, () => {
  console.log("Server started on port 8000")
})