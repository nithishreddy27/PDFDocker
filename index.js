const puppeteer = require("puppeteer");
const express = require("express");

const app = express();
// const browser =

app.get("/start", async (req, res) => {
  try {
    console.log("browser started");
    await puppeteer.launch({
      executablePath: "/usr/bin/google-chrome",
      headless: "new",
      ignoreDefaultArgs: ["--disable-extensions"],
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    console.log("browser lauched");
    res.send("browser lauched sucessfully");
  } catch (error) {
    console.log(`browser not lauched ${error}`);
    res.send(`browser not lauched ${error}`);
  }
});

app.get("/", (req, res) => {
  res.send("this is root");
});
app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
