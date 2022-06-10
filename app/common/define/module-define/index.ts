import gulp = require('gulp');
import clean = require('gulp-clean');
import copy = require('gulp-copy');
const sass = require('gulp-sass')(require('sass'));
// import fibers = require('fibers');
import postcss = require('gulp-postcss');
import cssnano = require('cssnano');
import autoprefixer = require('autoprefixer');

//-- sub dependencies
import plumber = require('gulp-plumber');
import cached = require('gulp-cached');
import ansiColors = require('ansi-colors');
import dependents = require('gulp-dependents');
let print = require('gulp-print');
let browserSync = require('browser-sync');
import prettier = require('gulp-prettier');
import htmlMinifer = require('gulp-htmlmin');
import tap = require('gulp-tap');
import babel = require('gulp-babel');
import browserify = require('browserify');
import babelify = require('babelify');
const vueifyBabel7 = require('@app/custom_node_modules/vueify');

const {createGulpEsbuild} = require('gulp-esbuild');
const gulpEsbuild = createGulpEsbuild({
	piping: true,
});
const vuePlugin = require('esbuild-vue');

import source = require('vinyl-source-stream');
import rename = require('gulp-rename');
import buffer = require('vinyl-buffer');
import uglify = require('gulp-uglify');
import cleanCss = require('gulp-clean-css');
import data = require('gulp-data');
import nunjucksRender = require('gulp-nunjucks-render');
import del = require('del');
import path = require('path');
import fs = require('fs');
import imageMin = require('gulp-imagemin');
import sassVars = require('gulp-sass-variables');
import eslint = require('gulp-eslint');
import util = require('gulp-util');
import gSourceMaps = require('gulp-sourcemaps');
import compressJson = require('gulp-jsonminify');
import runParallel = require('run-parallel');

import splitRequire = require('split-require');
import to = require('flush-write-stream');

import express = require('express');
import nunjucks = require('nunjucks');
import prerender = require('prerender');
import prerenderNode = require('prerender-node');

print = print.default;
browserSync = browserSync.create();

export {
  gulp,
  clean,
  sass,
  // fibers,
  postcss,
  autoprefixer,
  cssnano,
  copy,

  // sub dependencies
  plumber,
  ansiColors,
  cached,
  dependents,
  print,
  browserSync,
  prettier,
  htmlMinifer,
  tap,
  babel,
  browserify,
  babelify,
  vueifyBabel7,
  gulpEsbuild,
  vuePlugin,
  source,
  rename,
  buffer,
  uglify,
  cleanCss,
  data,
  nunjucksRender,
  del,
  path,
  fs,
  imageMin,
  sassVars,
  eslint,
  util,
  gSourceMaps,
  compressJson,
  runParallel,

  splitRequire,
  to,

  express,
  nunjucks,
  prerender,
  prerenderNode,
};

export default {
  gulp,
  clean,
  sass,
  // fibers,
  postcss,
  autoprefixer,
  cssnano,
  copy,

  // sub dependencies
  plumber,
  ansiColors,
  cached,
  dependents,
  print,
  browserSync,
  prettier,
  htmlMinifer,
  tap,
  babel,
  browserify,
  babelify,
  vueifyBabel7,
  gulpEsbuild,
  vuePlugin,
  source,
  rename,
  buffer,
  uglify,
  cleanCss,
  data,
  nunjucksRender,
  del,
  path,
  fs,
  imageMin,
  sassVars,
  eslint,
  util,
  gSourceMaps,
  compressJson,
  runParallel,

  splitRequire,
  to,

  express,
  nunjucks,
  prerender,
  prerenderNode,
}
