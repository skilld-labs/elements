// this will be moved to separated package

const { env } = require('process');
const fs = require('fs/promises');
const { basename, join } = require('path');
const { getYaml, writeLibrary } = require('./yaml');

const { name, type, lib } = getYaml('info.yml');

const componentDest = `components/${lib}/${type}/${name}`;
const overridesDest = `src/css/components/${lib}/${type}/${name}`;

const targets = [
  {
    src: './behaviour.js',
    dest: componentDest,
  },
  {
    src: './component.css',
    dest: componentDest,
  },
  {
    src: './component.html.twig',
    dest: componentDest,
  },
  {
    src: './library.yml',
    dest: componentDest,
  },
  {
    src: './layout.yml',
    dest: componentDest,
  },
  {
    src: './overrides.css',
    dest: overridesDest,
  },
  {
    src: './story.stories.js',
    dest: componentDest,
  },
];

targets.forEach(async (target) => {
  await fs.mkdir(join(env.INIT_CWD, target.dest), { recursive: true });

  const destPath = join(env.INIT_CWD, target.dest, basename(target.src));
  await fs.copyFile(target.src, destPath);
});

// not working yet
writeLibrary();
