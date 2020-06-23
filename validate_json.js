 /*jshint esversion: 6 */
 const path = require('path');
 const fs = require('fs-extra')

 const PUBLIC = 'public'
 const pathOfPublic = path.join(__dirname, PUBLIC);
 const VERSION = 2

 // validating version 2
 async function validate() {
     const pathOfVersion = path.join(pathOfPublic, 'v' + VERSION);
     const pathOfApps = path.join(pathOfVersion, 'apps');
     const versionString = (VERSION + '');

     const items = await fs.readdir(pathOfApps)
     const apps = items.filter(fileName => fileName.includes('.json'));
     const appDetails = [];

     for (var i = 0; i < apps.length; i++) {
         const contentString = fs.readFileSync(path.join(pathOfApps, apps[i]));
         const content = JSON.parse(contentString)
         const captainVersion = (content.captainVersion + '');
         if (versionString !== captainVersion)
             throw new Error(`unmatched versions   ${versionString}  ${captainVersion} for ${apps[i]}`)

         apps[i] = apps[i].replace('.json', '');

         if (!content.displayName) {
             content.displayName = apps[i];
             content.displayName = content.displayName.substr(0, 1).toUpperCase() + content.displayName.substring(1, content.displayName.length);
         }
         if (!content.description) content.description = '';

         const logoFileName = apps[i] + '.png';

         appDetails[i] = {
             name: apps[i],
             displayName: content.displayName,
             description: content.description,
             logoUrl: logoFileName
         }

         const logoFullPath = path.join(pathOfVersion, 'logos', logoFileName);

         if (!fs.existsSync(logoFullPath) ||
             !fs.statSync(logoFullPath).isFile()) {
             let printablePath = logoFullPath;
             printablePath = printablePath.substr(printablePath.indexOf(`/${PUBLIC}`))
             throw new Error(`Cannot find logo for ${apps[i]} ${printablePath}`);
         }
         console.log(`Validated ${apps[i]}`)
     }
 }


 Promise.resolve()
     .then(function () {
         return validate()
     })
     .catch(function (err) {
         console.error(err)
         process.exit(127)
     })