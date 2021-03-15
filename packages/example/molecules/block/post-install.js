// this script will be moved to separated package.
// and serve initial component installation copy.

const { env } = require("process");
const fs = require('fs/promises')
const { basename, join } = require('path')

// we need to generate that pathes dynamically from .libraries.yml
// and use in both postinstall and rollup
const targets = [
  {
    src: "./component.libraries.yml",
    dest: "components/example/molecules/block",
  },
  {
    src: "./component.layouts.yml",
    dest: "components/example/molecules/block",
  },
  {
    src: "./component.css",
    dest: "components/example/molecules/block",
  },
  {
    src: "./behaviour.js",
    dest: "components/example/molecules/block",
  },
  {
    src: "./overrides.css",
    dest: "src/css/components/example/molecules/block",
  },
];

const copyFiles = () => {
  targets.forEach(async target => {
    await fs.mkdir(join(env.INIT_CWD, target.dest), { recursive: true })

    const destPath = join(env.INIT_CWD, target.dest, basename(target.src))
    await fs.copyFile(target.src, destPath)
  })
};

module.exports = { copyFiles };
