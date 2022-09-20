/*
 *
 * (c) Copyright Ascensio System Limited 2010-2017
 *
 * The MIT License (MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

var express = require("express");
var mime = require("mime");
var path = require("path");
var bodyParser = require("body-parser");
var fileSystem = require("fs");
var config = require("config");
var docbuilderHelper = require("./helpers/docbuilderHelper");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.on("SIGINT", function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  // some other closing procedures go here
  process.exit(0);
});

var app = express();

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// ... to front files
const path2Front = path.resolve(__dirname, "..", "..", "dist", "front");
console.log(" Path to front '/': " + path2Front);
app.use("/", express.static(path2Front));

app.use(express.static(path.join(__dirname, "public")));
if (config.has("server.static")) {
  var staticContent = config.get("server.static");
  for (var i = 0; i < staticContent.length; ++i) {
    var staticContentElem = staticContent[i];
    app.use(
      staticContentElem["name"],
      express.static(staticContentElem["path"], staticContentElem["options"])
    );
  }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// var defaultScript = function () {
//   return fileSystem.readFileSync(
//     path.join("public", "samples", "sample.docbuilder")
//   );
// };

app.get("/getSourceFiles", function (req, res) {
  const result = [];
  try {
    let samplesFolder = path.join(__dirname, "../../public/samples/");
    fileSystem.readdir(samplesFolder, (err, files) => {
      if (err) {
        console.error(err);
      } else {
        files.forEach((file) => {
          result.push(file);
        });
        res.send({ result: true, sourceFiles: result });
      }
    });
  } catch (error) {
    res.send({ result: false, errorMessage: error.errorMessage });
  }
});

app.post("/uploadFromFile", function (req, res) {
  const fileName = req.body.fileName;
  try {
    let file = path.join(__dirname, "../../public/samples/", fileName);
    fileSystem.readFile(file, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.send({ result: false, errorMessage: JSON.stringify(err) });
      } else {
        res.send({ result: true, fileContent: data });
      }
    });
  } catch (error) {
    res.send({ result: false, msg: error.errorMessage });
  }
});

app.post("/generate", function (req, res) {
  var builderScript = (req.body.PredefinedScript || "").trim();
  try {
    var outputFilePath = docbuilderHelper.generateDocument(builderScript);
    console.log("outputFilePath: " + outputFilePath);

    var fileName = path.basename(outputFilePath) || "output..tmp.docx";
    fileName = fileName.substring(1 + fileName.indexOf(".", 7));
    res.download(outputFilePath, fileName);
  } catch (ex) {
    console.log(ex);
    res.send({ result: false, msg: ex.errorMessage });
    return;
  }
});

// app.post("/create", function (req, res) {
//   try {
//     var name = (req.body.NameText || "").trim();
//     if (name == "") {
//       name = "John Smith";
//     }

//     var company = (req.body.CompanyText || "").trim();
//     if (company == "") {
//       company = "ONLYOFFICE";
//     }

//     var title = (req.body.TitleText || "").trim();
//     if (title == "") {
//       title = "Commercial director";
//     }

//     var format = req.body["docx"] ? "docx" : req.body["xlsx"] ? "xlsx" : "pdf";

//     var outputFilePath = docbuilderHelper.CreateDocument(
//       name,
//       company,
//       title,
//       format
//     );

//     var fileName = path.basename(outputFilePath) || "output..docx";
//     fileName = "Sample" + fileName.substring(fileName.indexOf(".", 7));

//     res.setHeader("Content-Length", fileSystem.statSync(outputFilePath).size);
//     res.setHeader("Content-disposition", "attachment; filename=" + fileName);
//     res.setHeader("Content-type", mime.lookup(outputFilePath));

//     var filestream = fileSystem.createReadStream(outputFilePath);
//     filestream.pipe(res);
//   } catch (ex) {
//     console.log(ex);
//     res.render("index", {
//       predefinedScript: defaultScript(),
//       errorMessage: JSON.stringify(ex),
//     });
//     return;
//   }
// });

app.use(function (req, res, next) {
  console.error(req);
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// app.use(function (err, req, res, next) {
//     res.status(err.status || 500);
//         res.render("index", { predefinedScript: defaultScript(), errorMessage: "Server error" });
// });

module.exports = app;
