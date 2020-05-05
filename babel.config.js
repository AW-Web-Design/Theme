let defaultPresets;

if (process.env.BABEL_ENV === 'es') {
  defaultPresets = [];
} else {
  defaultPresets = [];
}

const defaultAlias = {};

const productionPlugins = [
  '@babel/plugin-transform-react-constant-elements',
  'babel-plugin-transform-dev-warning',
  ['babel-plugin-react-remove-properties', { properties: ['autoId'] }],
  [
    'babel-plugin-transform-react-remove-prop-types',
    {
      mode: 'unsafe-wrap',
    },
  ],
];

module.exports = {
  presets: defaultPresets.concat(['@babel/preset-react', '@babel/preset-typescript']),
  plugins: [
    'babel-plugin-optimize-clsx',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
    // any package needs to declare 7.4.4 as a runtime dependency. default is ^7.0.0
    ['@babel/plugin-transform-runtime', { version: '^7.4.4' }],
    // for IE 11 support
    '@babel/plugin-transform-object-assign',
  ],
  ignore: [/@babel[\\|/]runtime/], // Fix a Windows issue.
  env: {
    cjs: {
      plugins: productionPlugins,
    },
    coverage: {
      plugins: [
        'babel-plugin-istanbul',
        [
          'babel-plugin-module-resolver',
          {
            root: ['./'],
            alias: defaultAlias,
          },
        ],
      ],
    },
    development: {
      plugins: [
        [
          'babel-plugin-module-resolver',
          {
            alias: {
              modules: './modules',
            },
          },
        ],
      ],
    },
    esm: {
      plugins: [...productionPlugins, ['@babel/plugin-transform-runtime', { useESModules: true }]],
    },
    es: {
      plugins: [...productionPlugins, ['@babel/plugin-transform-runtime', { useESModules: true }]],
    },
    production: {
      plugins: [...productionPlugins, ['@babel/plugin-transform-runtime', { useESModules: true }]],
    },
    'production-umd': {
      plugins: [...productionPlugins, ['@babel/plugin-transform-runtime', { useESModules: true }]],
    },
    test: {
      sourceMaps: 'both',
      plugins: [
        [
          'babel-plugin-module-resolver',
          {
            root: ['./'],
            alias: defaultAlias,
          },
        ],
      ],
    },
    benchmark: {
      plugins: [
        ...productionPlugins,
        [
          'babel-plugin-module-resolver',
          {
            root: ['./'],
            alias: defaultAlias,
          },
        ],
      ],
    },
  },
};
