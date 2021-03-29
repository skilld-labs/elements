// this is copy of drupal-yaml, with some updates.

const { dump, load } = require('js-yaml');
const { appendFileSync, readFileSync, writeFileSync } = require('fs');
const { sync } = require('glob');
const { join } = require('path');
const { env } = require('process');
const { diff } = require('semver');

const INFO_GLOB = '*.info.yml';
const LAYOUT_GLOB = '*.layouts.yml';
const LIB_GLOB = '*.libraries.yml';

const MAJOR_VERSION_DIFF_MESSAGE = `
  You try to add component: "%s" with incompatible API changes.
  Existing version is: %s
  New version is: %s
  More info: https://semver.org/
`;

const UPDATED_MESSAGE = `
  Your component: "%s" was updated.
  Previous version was: %s
  New version is: %s
`;

const NEW_COMPONENT_MESSAGE = `
  New component: "%s" was added.
`;

const testBlock = {
  m_block: {
    version: '1.0.0',
    css: {
      base: { 'components/core/molecules/block/block.css': {} },
      theme: { 'src/css/components/block/block-overrides.css': {} },
    },
    js: { 'components/core/molecules/block/block-behaviour.js': {} },
    dependencies: ['core/drupal'],
  },
};

const testLayoutBlock = {
  m_block: {
    label: 'M Block',
    path: 'components/core/molecules/block',
    template: 'm-block',
    library: 'approach/block',
    default_region: 'body',
    icon_map: [['title'], ['body']],
    regions: { title: { label: 'Title' }, body: { label: 'Body' } },
  },
};

const checkVersion = (existingVersion, newVersion, libraryName) => {
  const semverDiff = diff(existingVersion, newVersion);
  if (semverDiff === 'major') {
    console.warn(
      MAJOR_VERSION_DIFF_MESSAGE,
      libraryName,
      existingVersion,
      newVersion,
    );
    return false;
  }
  // if versions are same.
  if (semverDiff === null) {
    return false;
  }
  return true;
};

const isLibraryPresents = (libraries = {}, libraryName) =>
  Object.keys(libraries).includes(libraryName);

const getFile = (fileType) => {
  const files = sync(join(env.INIT_CWD, fileType));
  if (files.length === 1) {
    return files[0];
  }
};

const getYaml = (fileType) => load(readFileSync(getFile(fileType)));

const getThemeName = () => {
  const { name } = getYaml(INFO_GLOB);
  return name;
};

const writeLibrary = (library = testBlock) => {
  const libraryName = Object.keys(library)[0];
  const libraries = getYaml(LIB_GLOB);
  if (isLibraryPresents(libraries, libraryName)) {
    const previousVersion = libraries[libraryName].version;
    const newVersion = library[libraryName].version;
    // update library.
    if (checkVersion(previousVersion, newVersion, libraryName)) {
      libraries[libraryName] = library[libraryName];
      writeFileSync(getFile(LIB_GLOB), dump(libraries), 'utf8');
      console.log(UPDATED_MESSAGE, libraryName, previousVersion, newVersion);
    }
  } else {
    // add new library.
    appendFileSync(getFile(LIB_GLOB), dump(library), 'utf8');
    console.log(NEW_COMPONENT_MESSAGE, libraryName);
  }
};

module.exports = { getYaml, writeLibrary };
