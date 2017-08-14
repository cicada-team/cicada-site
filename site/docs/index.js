#!/usr/bin/env node
/**
 * execute order:  walk->readFile
 * return js object that parsed from markdown files in src folder
 */
const fs = require('fs')
const parser = require('./parser')
const argv = require('minimist')(process.argv.slice(2))
const path = require('path')

/**
 * argv options: {s: src, o: output, t: file type[blog, doc, api]}
 */
const OUTPUT_PATH = `${process.cwd()}/${argv.o}` || `${__dirname}/output`
const INPUT_PATH = `${process.cwd()}/${argv.s}` || `${__dirname}/src`
// const OUTPUT_PATH = `${argv.o}` || `${__dirname}/output`
// const INPUT_PATH = `${argv.s}` || `${__dirname}/src`

const CONFIG_PATH = argv.c || '../default.config.json'
// const config = require(CONFIG_PATH)
const config = {
  githubLink: 'githubLikn',
}
const TYPE = argv.t || 'doc'
const GITHUB_PREFIX = 'http://xxx'
const PROJ_ROOT = process.cwd()

const OUTPUT_FILE_NAME = TYPE

const CATLOG_ARRAY = Array(5).fill('Group')

const save = (data, fileName, path) => {
  /* eslint-disable */
  const ext = '.json'
  const fileNameWithExt = fileName + ext
  const fullPath = `${path}/${fileNameWithExt}`
  fs.writeFileSync(fullPath, data, (_error) => {
    if (_error) {
      throw _error
    }
    console.log(`${path}/${fileNameWithExt} has been created.`)
  })
};

const getFileName = (filePath) => {
  const regex = /^\/(.+\/)*(.+)\.(.+)$/g
  const matched = regex.exec(filePath)  
  const fileName = matched['2']
  return fileName
}

const readFile = filePath => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    // console.log(filePath)
    const fileName = getFileName(filePath)
    const mdObject = parser(data, fileName);
    // add github url
    mdObject.githubLink = getGithubLink(filePath)
    return mdObject;
  } catch (_error) {
    throw _error;
  }
};

const getGithubLink = (filePath) => {
  const relativePath = path.relative(PROJ_ROOT, filePath)
  const prefix = config.githubLink || GITHUB_PREFIX
  const fullUrl = prefix + "/" + relativePath
  return fullUrl
}

// TODO const not working but var works with semicolon
const walk = function(dirPath, cb) {
  let result = [];
  fs.readdir(dirPath, (_error, list) => {
    if (_error) {
      return cb(_error);
    }
    // skip hidden files
    list = list.filter(item => !/(^|\/)\.[^\/\.]/g.test(item));
    let i = 0;
    (function next() {
      const file = list[i++];
      if (!file) return cb(null, result);
      filePath = `${dirPath}/${file}`;
      fs.stat(filePath, (_error, stat) => {
        if (stat && stat.isDirectory()) {
          walk(filePath, (_error, res) => {
            result = result.concat(res);
            next();
          });
        } else {
          result.push(filePath);
          next();
        }
      });
    })();
  });
};
// ascending sorting
const compare = (a, b) => {
  if (a.index > b.index) return 1;
  if (a.index < b.index) return -1;
  return 0;
};

const insertCatLog = (index, group) => {
  CATLOG_ARRAY.splice.apply(CATLOG_ARRAY, [index, 0].concat(group));
};

/**
 * blog meta data: 
 * content, date, title, url, author(optional)
 */
function parseBlog() {
  const blogObjectList = {};
  walk(INPUT_PATH, (_error, result) => {
    result.forEach(filePath => {
      // file generated
      console.log("Read " + filePath);
      mdObject = readFile(filePath);
      if (mdObject === undefined) {
        return;
      }
      // use title as the unique key
      if (mdObject.url !== undefined) {
        blogObjectList[mdObject.url] = mdObject;
      }
    });
    save(JSON.stringify(blogObjectList), OUTPUT_FILE_NAME, OUTPUT_PATH);
  });
}
/**
 * api meta data:
 * content, title, url, toc
 */
function parseApi() {
  const apiObjectList = {};
  walk(INPUT_PATH, (_error, result) => {
    result.forEach(filePath => {
      console.log("Read " + filePath);
      const mdObject = readFile(filePath);
      if (mdObject === undefined) {
        return;
      }
      if (mdObject.url !== undefined) {
        apiObjectList[mdObject.url] = mdObject;
      }
    });
    save(JSON.stringify(apiObjectList), OUTPUT_FILE_NAME, OUTPUT_PATH);
  });
}

function parseDoc() {
  const docObject = {};
  const mdObjectList = {};
  const sortedCatLog = {};
  const metaObjectByGroup = {};
  let groupList = [];
  walk(INPUT_PATH, (_error, result) => {
    result.forEach(filePath => {
      // file generated
      console.log("Created " + filePath);
      mdObject = readFile(filePath);
      if (mdObject === undefined) {
        return;
      }
      // use title as the unique key
      if (mdObject.url !== undefined) {
        mdObjectList[mdObject.url] = mdObject;
      }
      // handle group and docs
      const index = mdObject.index;

      if (mdObject.group !== undefined && mdObject.index !== undefined) {
        groupList[index[0]] = mdObject.group;
        const meta = {
          title: mdObject.title,
          url: mdObject.url
        };
        let metaObject = {};
        metaObject["index"] = index[1];
        metaObject["meta"] = meta;
        if (metaObjectByGroup[mdObject.group] === undefined) {
          let metaList = [];
          metaList.push(metaObject);
          metaObjectByGroup[mdObject.group] = metaList;
        } else {
          metaList = metaObjectByGroup[mdObject.group];
          metaList.push(metaObject);
          metaObjectByGroup[mdObject.group] = metaList;
        }
      }
    });
    // sort each metaList and sort the group
    groupList.forEach(group => {
      metaObjectByGroup[group].sort(compare);
      sortedCatLog[group] = metaObjectByGroup[group];
    });
    save(JSON.stringify(mdObjectList), OUTPUT_FILE_NAME, OUTPUT_PATH);
    save(
      JSON.stringify(sortedCatLog),
      `${OUTPUT_FILE_NAME}-Catalog`,
      OUTPUT_PATH
    );
  });
}

/**
 * common meta data: 
 * content, date, title, url, author(optional), toc
 */
function parseCommon() {
  const objectList = {};
  walk(INPUT_PATH, (_error, result) => {
    result.forEach(filePath => {
      // file generated
      console.log("Read " + filePath);
      mdObject = readFile(filePath);
      if (mdObject === undefined) {
        return;
      }
      // use title as the unique key
      if (mdObject.url !== undefined) {
        objectList[mdObject.url] = mdObject;
      }
    });
    save(JSON.stringify(objectList), OUTPUT_FILE_NAME, OUTPUT_PATH);
  });
}

if (TYPE === "doc") {
  parseDoc();
} else if (TYPE === "blog") {
  parseBlog();
} else if (TYPE === "api") {
  parseDoc();
} else if (TYPE == "common") {
  parseCommon();
}

