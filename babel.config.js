const workletsPluginOptions = {
  // Your custom options.
}
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: [
          { "@shared-components": "./src/shared/components" },
          { "@shared-constants": "./src/shared/constants" },
          { "@localization": "./src/shared/localization" },
          { "@font-size": "./src/shared/theme/font-size" },
          { "@api": "./src/services/api/index" },
          { "@fonts": "./src/shared/theme/fonts/index" },
          { "@colors": "./src/shared/theme/colors" },
          { "@theme": "./src/shared/theme" },
          { "@models": "./src/services/models" },
          { "@services": "./src/services" },
          { "@screens": "./src/screens" },
          { "@utils": "./src/utils/" },
          { "@assets": "./src/assets/" },
          { "@event-emitter": "./src/services/event-emitter" },
          { "@local-storage": "./src/services/local-storage" },
          { "@zustand": "./src/services/zustand/store" },
          { "@helpers": "./src/helpers" },
        ],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }
    ],
    ['react-native-worklets/plugin', workletsPluginOptions], 

  ],
  env: {
    production: {
      plugins: [
        'transform-remove-console',
        [
          "module:react-native-dotenv",
          {
            moduleName: "@env",
            path: ".env",
            blacklist: null,
            whitelist: null,
            safe: false,
            allowUndefined: true,
          },
        ],
        [
          "module-resolver",
          {
            root: ["./src"],
            alias: [
              { "@shared-components": "./src/shared/components" },
              { "@shared-constants": "./src/shared/constants" },
              { "@localization": "./src/shared/localization" },
              { "@font-size": "./src/shared/theme/font-size" },
              { "@api": "./src/services/api/index" },
              { "@fonts": "./src/shared/theme/fonts/index" },
              { "@colors": "./src/shared/theme/colors" },
              { "@theme": "./src/shared/theme" },
              { "@models": "./src/services/models" },
              { "@services": "./src/services" },
              { "@screens": "./src/screens" },
              { "@utils": "./src/utils/" },
              { "@assets": "./src/assets/" },
              { "@event-emitter": "./src/services/event-emitter" },
              { "@local-storage": "./src/services/local-storage" },
              { "@zustand": "./src/services/zustand/store" },
              { "@helpers": "./src/helpers" },
            ],
            extensions: [".js", ".jsx", ".ts", ".tsx"]
          }
        ]
      ],
    },
  }
};
