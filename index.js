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

app.get("/kota/all", (req, res) => {
  axios.get("https://jadwalsholat.org/adzan/ajax.row.php?id=").then(async response => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    
    const $ = cheerio.load(response.data)
    const data = []
    
    for (let i = 0; i < $("option").length; i++) {
      const id = $("option").eq(i).attr("value")
      const kota = $("option").eq(i).html()

     const getWaktu =  await axios.get("https://jadwalsholat.org/ajax/ajax.daily1.php?id=" + id)
      const $2 = cheerio.load(getWaktu.data)
       const waktuShubuh = $2("tr.table_light").eq(0).find("td").eq(1)
      const waktuDzuhur = $2("tr.table_dark").eq(0).find("td").eq(1)
      const waktuAshar = $2("tr.table_light").eq(1).find("td").eq(1)
      const waktuMahgrib = $2("tr.table_dark").eq(1).find("td").eq(1)
      const waktuIsya = $2("tr.table_light").eq(2).find("td").eq(1)
      data.push({
        "kota" : kota,
        "id" : id,
        "waktusholat" : {
          "shubuh" : waktuShubuh.text(),
          "dzuhur" : waktuDzuhur.text(),
          "ashar" : waktuAshar.text(),
          "mahgrib" : waktuMahgrib.text(),
          "isya" : waktuIsya.text()
        }
        })
      
    }
    const data2 = data.slice(startIndex, endIndex)
    res.json({
      "page" : page,
      "limit" : limit,
      "result" : data2,
    })
  })
}) 
  
app.listen(8000, () => {
  console.log("Server started on port 8000")
})