//imports
const path = require("path");
const justo = require("justo");
const catalog = justo.catalog;
const clean = require("justo-plugin-fs").clean;
const copy = require("justo-plugin-fs").copy;
const lessc = require("justo-plugin-less").compile;
const bootlint = require("justo-plugin-bootlint");
const chrome = require("justo-plugin-chrome");
const ghpages = require("justo-plugin-gh-pages");

//catalog
catalog.workflow({name: "build", desc: "Create the app."}, function() {
  bootlint("Lint Bootstrap code", {
    src: "app/es/",
    ignore: "app/es/curso"
  });

  clean("Clean dist directory", {
    dirs: ["dist"]
  });

  copy("Copy app", {
    src: "app/",
    dst: "dist",
    ignore: "app/styles"
  });

  lessc("Compile Less style sheets", {
    src: "app/styles/",
    dst: "dist/styles/"
  });

  copy("Copy Bootstrap framework", [
    {src: "bower_components/bootstrap/dist/css/bootstrap.min.css", dst: "dist/styles/"},
    {src: "bower_components/bootstrap/dist/js/bootstrap.min.js", dst: "dist/scripts/"},
    {src: "bower_components/bootstrap/dist/js/umd/", dst: "dist/scripts/"}
  ]);
});

catalog.workflow({name: "open", desc: "Open app in Chrome."}, function() {
  chrome.open("Open Chrome", {
    path: "C:\\Program Files (x86)\\Google\\Chrome\\Application",
    src: path.join(process.cwd(), "dist/es/index.html"),
    newWindow: true
  });
});

catalog.workflow({name: "publish", desc: "Publish GitHub Pages."}, function() {
  ghpages("Publish GitHub Pages", {
    type: "project",
    src: "dist/"
  });

  chrome.open("Open Chrome", {
    path: "C:\\Program Files (x86)\\Google\\Chrome\\Application",
    src: "http://justojsorg.github.io/www.justojs.org/es/index.html",
    newWindow: true
  });
});

catalog.macro({name: "default", desc: "Default task."}, ["build", "open"]);
