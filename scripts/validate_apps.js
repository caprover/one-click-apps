 /*jshint esversion: 6 */
 const path = require('path');
 const yaml = require('yaml');
 const fs = require('fs-extra');

 const PUBLIC = `public`;
 const pathOfPublic = path.join(__dirname, '..', PUBLIC);


 // validating version 4
 function validateV4() {

     const version = '4';
     const pathOfVersion = path.join(pathOfPublic, 'v' + version);
     const pathOfApps = path.join(pathOfVersion, 'apps');

     return fs.readdir(pathOfApps)
         .then(function (files) {

             const apps = files.filter(v => v.includes('.yml'));

             if (files.length !== apps.length) {
                 throw new Error('All files in v4 must end with .yml');
             }

             for (var i = 0; i < apps.length; i++) {
                 const contentString = fs.readFileSync(path.join(pathOfApps, apps[i]), 'utf-8');
                 const content = yaml.parse(contentString);
                 const captainVersion = (content.captainVersion + '');
                 const versionString = (version + '');
                 if (versionString !== captainVersion)
                     throw new Error(`unmatched versions   ${versionString}  ${captainVersion} for ${apps[i]}`);

                 apps[i] = apps[i].replace('.yml', '');

                 if (!content.caproverOneClickApp) {
                     throw new Error(`Cannot find caproverOneClickApp for ${apps[i]}`);
                 }

                 if (!content.caproverOneClickApp.description) {
                     throw new Error(`Cannot find description for ${apps[i]}`);
                 }

                 if (content.caproverOneClickApp.description.length > 200) {
                     throw new Error(`Description too long for ${apps[i]}  - keep it below 200 chars`);
                 }

                 if (!content.caproverOneClickApp.instructions ||
                     !content.caproverOneClickApp.instructions.start ||
                     !content.caproverOneClickApp.instructions.end) {
                     throw new Error(`Cannot find instructions.start or instructions.end for ${apps[i]}`);
                 }

                 if (!content.services) {
                     throw new Error(`Cannot find services for ${apps[i]}`);
                 }

                 if (!content.caproverOneClickApp.variables.find((v) => v.id === '$$cap_app_version')) {
                     throw new Error(`Cannot find version for ${apps[i]}`);
                 }
                 const versionApp = content.caproverOneClickApp.variables.find((v) => v.id === '$$cap_app_version')
                 if(versionApp.defaultValue === 'latest'){
                     throw new Error(`"latest" tag is not allowed as it can change and break the setup, see ${apps[i]}`);
                 }
                 if(!versionApp.description) {
                        throw new Error(`Version description must included here, see ${apps[i]}`);
                 }
                 if(!versionApp.description.match('tags') && !versionApp.description.match('github') && !versionApp.description.match('gitlab')) {
                     throw new Error(`Version description must contain a link to the tags page, see ${apps[i]}`);
                 }

                 Object.keys(content.services).forEach(
                     (serviceName) => { // jshint ignore:line
                         const s = content.services[serviceName];
                         if (s.image && s.image.endsWith(':latest')) {
                             // throw new Error(`"latest" tag is not allowed as it can change and break the setup, see ${apps[i]}`);
                         }
                     });

                 const logoFileName = apps[i] + '.png';

                 const logoFullPath = path.join(pathOfVersion, 'logos', logoFileName);

                 if (!fs.existsSync(logoFullPath) ||
                     !fs.statSync(logoFullPath).isFile()) {
                     let printablePath = logoFullPath;
                     printablePath = printablePath.substr(printablePath.indexOf(`/${PUBLIC}`));
                     throw new Error(`Cannot find logo for ${apps[i]} ${printablePath}`);
                 }

                 console.log(`Validated ${apps[i]}`);

             }

         });
 }

 Promise.resolve()
     .then(function () {
         return validateV4();
     })
     .catch(function (err) {
         console.error(err);
         process.exit(127);
     });
