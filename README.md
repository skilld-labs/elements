# elements

New repo for component based development.

# workflow.
## Add existing component.
`yarn add @skilld/elements/components/m-block`

Command uses postinstall script https://yarnpkg.com/advanced/lifecycle-scripts (with rollup approach of core https://www.drupal.org/project/drupal/issues/3185289 )
- installs component as node module
- copies required files to /components/molecules directory. twig/js/css ( they can/should be commited and updated with yarn/rollup in core style )
- builds required scripts/css EG /components/molecules/block/block.css
- creates /src/css/components/block/m-block-variables.css + /src/css/components/block/m-block-overrides.css where we can override default variables and styles.
- if not yet registered adds twig namespace in Drupal Module Components style https://www.drupal.org/docs/contributed-modules/components/registering-twig-namespaces
- magic will be here. we can edit Yaml files https://www.npmjs.com/package/@rollup/plugin-yaml

  1. and add library in .libraries.yml with path to created /src/css/components/block/m-block-variables.css and /src/css/components/block/m-block-overrides.css and /components/molecules/block/block.css
  2. or add layout into .layouts.yml with path to created /components/molecules/block/m-block.twig
  3. using env variables in script we may enable library in .info.file ( or keep it enabled by default and disable optionally )
- For small repeatable atoms like `Link with icon >` or `a-title` we may deploy drupal module with field formatters https://www.drupal.org/docs/creating-custom-modules/creating-custom-field-types-widgets-and-formatters/create-a-custom-1
- we may optionally use power of https://www.drupal.org/project/layout_builder_styles or https://www.drupal.org/project/layout_builder_component_attributes
  to set default and overriden variables. EG --color-block-bg
- In case of external js/css creates line to external library https://www.drupal.org/docs/theming-drupal/adding-stylesheets-css-and-javascript-js-to-a-drupal-theme#external or add dependency in /src/js/init.js or in /src/css/styles.css
- Automatically added in storybook with https://storybook.js.org/docs/react/configure/overview#configure-your-storybook-project
- In case when one components has dependency. postinstall script should install all needed EG `m-block` needs `a-title`

in this approach we have layout/twig/css/js enabled in drupal theme without front intervention.


## When core component changed and theme conponent needs update (steps from https://www.drupal.org/project/drupal/issues/3185289 )
```
yarn outdated
yarn upgrade X Y Z
yarn run rollup # command name subject to change.
```

## To change core component
we change it in repo and change package.json version strictly using https://semver.org/

## To create new theme
Run @skilld/elements/theme-generator inspired by https://github.com/skilld-labs/kaizen/tree/master/packages/kaizen-tg

## To create new component
- Run @skilld/elements/component-generator inspired by https://github.com/skilld-labs/kaizen/tree/master/packages/kaizen-cg
- Create /components/molecules/superblock -> Work with it -> test and later port to components library.

# Component structure
## TWIG
Frontmatter support https://www.drupal.org/project/drupal/issues/3064854 may give lot of potential use cases. At least for default values

## JS
2 files now. One is component itself for development and storybook. Another for drupalBehaviours.
- behaviours file can be generated automatically on postinstall step
- All external dependencies should be added as prod dependencies in component package.json. and added on postinstall step

## Storybook.
same approach as in kaizen with improvements:
- add https://github.com/marak/Faker.js/ to generate dummy data. Maybe as global package @elements/dummy/long-menu @elements/dummy/kitten-pic
- https://www.npmjs.com/package/@storybook/addon-knobs should be fixed and used for all components. In storybook based development buisiness usually asks for real content displayed
- Fix docs usage. All modifications/variables and usage in drupal should be described.
- In case of includes component to component package.json should contain dependency. EG `m-block` needs `a-title`

## YML
We need to store component library info / layout info which will be used on component drupal installation
Also it may contain component config like `install as layout`: true etc

## JSON
Seems not needed anymore in faker.js / frontmatter approach

## CSS
Kaizen approach 2 files. Plus variables.css file which will became /src/css/components/block/m-block-variables.css on postinstall
Everything on variables. Variables policy should be well described in docs.
Clean BEM structure.
Postcss.
One common breakpoints config for all suthemes


# Theme structure.
Repeats zero config kaizen
- research ability to import yaml files https://symfony.com/doc/current/service_container/import.html#importing-configuration-with-imports


# Required packages
We will create few new packages like in https://github.com/skilld-labs/kaizen/tree/master/packages
- Drupal yaml reader/writer. Check/add/update theme yml files. exports functions like `addLibrary`, `addLayout` Rework of https://github.com/skilld-labs/kaizen/tree/master/packages/kaizen-breakpoints
- Elements Component installer - controller of postinstall script. Probably with https://github.com/enquirer/enquirer style
- Updated theme generator kaizen-tg
- Updated component generator kaizen-cg. In fact we may create 2 packages. one for creation of drupal theme component, and one for source component.
- Global components. Stores icons / global settings / breakpoints.
- Components demo. To run/build/develop storybook of components in node environment only.

# Stack.
- Yarn 2. Better to start with its new nice features.
- Rollup. In core style.
