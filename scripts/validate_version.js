const path = require('path');
const yaml = require('yaml');
const fs = require('fs-extra');

const APPS_DIRECTORY = `public/v4/apps`;
const pathOfApps = path.join(__dirname, '..', APPS_DIRECTORY);

// validating version 4
const filesInErrors = [];
fs.readdir(pathOfApps).then((apps) => {
    for (var i = 0; i < apps.length; i++) {
        const contentString = fs.readFileSync(path.join(pathOfApps, apps[i]), 'utf-8');
        const content = yaml.parse(contentString);
        //console.log(content.caproverOneClickApp.variables);
        if (!content.caproverOneClickApp.variables.find((v) => v.id === '$$cap_app_version')) {
            filesInErrors.push(content.caproverOneClickApp.displayName);
        }
    }
}).then(() => {
    console.error(filesInErrors);
});
