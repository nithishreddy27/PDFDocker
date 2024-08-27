const puppeteer = require("puppeteer");
const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");
// const browser =
app.use(express.json());
app.use(cors());
function savePdfBufferToFile(pdfBuffer, filePath) {
  fs.writeFile(filePath, pdfBuffer, (err) => {
    if (err) {
      console.error("Error writing PDF file:", err);
    } else {
      console.log("PDF file saved successfully!");
    }
  });
}
app.post("/start", async (req, res) => {
  try {
    console.log("inside start", req.body);
    const htmlContent = req.body.htmlContent;

    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/google-chrome",
      headless: "new",
      ignoreDefaultArgs: ["--disable-extensions"],
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.status(200).json({ pdfBuffer });
  } catch (error) {
    console.error(`Failed to generate PDF: ${error}`);
    res.status(500).send(`Failed to generate PDF: ${error}`);
  }
});

app.get("/", (req, res) => {
  res.send("this is root");
});
app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
