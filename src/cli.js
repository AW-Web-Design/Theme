#!/usr/bin/env node

const sade = require('sade');
const StyleDictionary = require('style-dictionary');
const fs = require('fs-extra');
const path = require('path');
const { template } = require('lodash');
const Color = require('tinycolor2');

const Config = require('./config.json');

const configFileNames = ['orchard.theme.config.json'];

const resolveConfig = () =>
  new Promise(resolve => {
    for (let i = 0; i < configFileNames.length; i++) {
      fs.exists(`${process.cwd()}/${configFileNames[i]}`, exists => {
        if (exists) {
          resolve(`${process.cwd()}/${configFileNames[i]}`);
        }
      });
    }

    resolve(`./${configFileNames[0]}`);
  });

const minifyDictionary = obj => {
  const toRet = {};
  if (obj.value) {
    return obj.value;
  }

  for (const name in obj) {
    toRet[name] = minifyDictionary(obj[name]);
  }

  return toRet;
};

const nestedJson = dictionary => {
  if (dictionary.allProperties[0].name === 'neutral_base') {
    const properties = dictionary.properties;

    properties.color.neutrals = properties.color.neutral_base;
    delete properties.color.neutral_base;

    return `const tokens = ${JSON.stringify(
      minifyDictionary(properties[Object.keys(properties)[0]]),
      null,
      2
    )};

export default tokens;
`;
  }

  let output = dictionary.properties;

  if (output.color) {
    output = output.color;
  }
  if (output.modes) {
    output = output.modes;
  }
  if (output.dark) {
    output = output.dark;
  }
  if (output.light) {
    output = output.light;
  }
  if (output.size) {
    output = output.size;
  }

  if (output.breakpoints) {
    const minified = minifyDictionary(output.breakpoints);

    return `const tokens = ${JSON.stringify(
      {
        breakpoints: Object.keys(minified).map(key => minified[key]),
      },
      null,
      2
    )};

export default tokens;
    `;
  }

  return `const tokens = ${JSON.stringify(minifyDictionary(output), null, 2)};

export default tokens;
  `;
};

StyleDictionary.registerFormat({
  name: 'custom/nested/json',
  formatter: nestedJson,
});

StyleDictionary.registerFormat({
  name: 'custom/intent_tokens',
  formatter: template(
    fs.readFileSync(
      path.resolve(__dirname, './templates/intent_tokens.template')
    )
  ),
});

StyleDictionary.registerFormat({
  name: 'custom/neutrals_tokens',
  formatter: template(
    fs.readFileSync(
      path.resolve(__dirname, './templates/neutrals_tokens.template')
    )
  ),
});

StyleDictionary.registerTransform({
  name: 'color/makeShades',
  type: 'value',
  matcher(prop) {
    return prop.attributes.type === 'intents';
  },
  transformer(prop) {
    const color = Color(prop.value);
    const subtheme = { light: {}, dark: {} };
    const paletteLight = [];
    const paletteDark = [];

    const colorBase = Color('#222222');
    const colorLight = Color('#FFF');

    paletteLight.push(color.toHexString());
    paletteLight.push(Color.mix(color, colorBase, 10).toHexString());
    paletteLight.push(Color.mix(color, colorLight, 10).toHexString());
    paletteLight.push(Color.mix(color, colorLight, 35).toHexString());
    paletteLight.push(Color.mix(color, colorLight, 80).toHexString());

    paletteDark.push(color.toHexString());
    paletteDark.push(Color.mix(color, colorLight, 10).toHexString());
    paletteDark.push(Color.mix(color, colorBase, 10).toHexString());
    paletteDark.push(Color.mix(color, colorBase, 35).toHexString());
    paletteDark.push(Color.mix(color, colorBase, 80).toHexString());

    subtheme.light = paletteLight;
    subtheme.dark = paletteDark;

    return subtheme;
  },
});

StyleDictionary.registerTransform({
  name: 'color/makeNeutrals',
  type: 'value',
  matcher(prop) {
    // this is an example of a possible filter (based on the "cti" values) to show how a "matcher" works
    return prop.attributes.type === 'neutral_base';
  },
  transformer(prop) {
    const colorBase = Color(prop.value);
    const colorLight = Color('#FFFFFF');
    const neutrals = { light: {}, dark: {} };
    const paletteLight = [];
    const paletteDark = [];
    const percentages = [
      0,
      2,
      3,
      5,
      8,
      10,
      12,
      16,
      20,
      24,
      26,
      30,
      35,
      40,
      45,
      52,
      60,
      70,
      80,
      90,
      100,
    ];

    percentages.forEach(mixPercentage => {
      paletteLight.push(
        Color.mix(colorLight, colorBase, mixPercentage).toHexString()
      );
      paletteDark.push(
        Color.mix(colorBase, colorLight, mixPercentage).toHexString()
      );
    });

    neutrals.light = paletteLight;
    neutrals.dark = paletteDark;

    return neutrals;
  },
});

StyleDictionary.registerAction({
  name: 'copy_assets',
  do: function(_, config) {
    console.log('Copying assets directory');
    fs.copySync(config.buildPath, process.cwd() + `theme/${config.buildPath}`);
  },
  undo: function(_, config) {
    console.log('Cleaning assets directory');
    fs.removeSync(config.buildPath + 'dist');
  },
});

const generate = async options => {
  const brand = options.b || options.brand;
  const userConfigFile = await resolveConfig();
  const userConfig = fs.readJsonSync(userConfigFile);
  const outputDir = userConfig.outputDir
    ? `${process.cwd()}${userConfig.outputDir}theme/dist`
    : `${process.cwd()}/theme/dist`;
  const customSrcDir = userConfig.srcDir
    ? `${process.cwd()}${userConfig.srcDir}theme/src`
    : `${process.cwd()}/theme/src`;

  fs.ensureDir(outputDir);
  const ConfigWithSource = Config;
  if (fs.existsSync(customSrcDir)) {
    console.log('Using your config');
    ConfigWithSource.source = [`${customSrcDir}/**/*.json`];
  } else {
    console.log('Using default config');
    console.log(
      path.resolve(__dirname, `theme/${brand.toLowerCase()}/**/*.json`)
    );
    ConfigWithSource.source = [
      path.resolve(__dirname, `theme/${brand.toLowerCase()}/**/*.json`),
    ];
  }

  const BaseStyleDictionary = StyleDictionary.extend(ConfigWithSource);

  BaseStyleDictionary.buildAllPlatforms();

  fs.copySync(`./theme-dist`, outputDir);

  fs.removeSync(`./theme-dist`);
};

const cli = sade('orchard-theme');

cli
  .command('generate')
  .option(
    '-b, --brand',
    'Sets the brand if multiple brands are required else default',
    'default'
  )
  .action(options => {
    generate(options);
  });

cli.parse(process.argv);
