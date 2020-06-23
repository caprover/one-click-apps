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

     for (let i = 0; i < apps.length; i++) {
         const contentString = fs.readFileSync(path.join(pathOfApps, apps[i]));
         const content = JSON.parse(contentString)
         const { captainVersion, displayName, description } = content
         if (versionString !== captainVersion)
             throw new Error(`unmatched versions   ${versionString}  ${captainVersion} for ${apps[i]}`)

         apps[i] = apps[i].replace('.json', '');

         if (!displayName) {
           //DEVNOTE: mutation should be avoid
             content.displayName = apps[i];
             content.displayName = content.displayName.substr(0, 1).toUpperCase() + content.displayName.substring(1, content.displayName.length);
         }
       //DEVNOTE: mutation should be avoid
       if (!description) content.description = '';

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