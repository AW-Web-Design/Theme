const fs = require("fs-extra");

const configFileNames = ["orchard.theme.config.json"];

const resolveConfig = () => {
  for (let i = 0; i < configFileNames.length; i++) {
    fs.exists(`${process.cwd()}/${configFileNames[i]}`, (exists) => {
      if (exists) {
        return `${process.cwd()}/${configFileNames[i]}`;
      }
    });
  }
};

export default resolveConfig;
