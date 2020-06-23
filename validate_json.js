/*jshint esversion: 6 */
const path = require('path');
const fs = require('fs-extra')

const PUBLIC = 'public'
const pathOfPublic = path.join(__dirname, PUBLIC);
const VERSION = 2

function isLogoValid({ existsSync, statSync }, logoFullPath) {
  return existsSync(logoFullPath) && statSync(logoFullPath).isFile()
}

function isVersionValid(applicationVersion, capVersion) {
  return applicationVersion === capVersion
}

 // validating version 2
 async function validate() {
     const pathOfVersion = path.join(pathOfPublic, 'v' + VERSION);
     const pathOfApps = path.join(pathOfVersion, 'apps');
     const versionString = (VERSION + '');

     const items = await fs.readdir(pathOfApps)
     const apps = items.filter(fileName => fileName.includes('.json'));
     const applicationsDetails = apps.map(filename => {
       const contentString = fs.readFileSync(path.join(pathOfApps, filename));
       const content = JSON.parse(contentString)
       const { captainVersion, displayName, description } = content
       if (!isVersionValid(versionString, captainVersion))
         throw new Error(`unmatched versions   ${versionString}  ${captainVersion} for ${filename}`)
        const appName = filename.replace('.json', '');
       const realDisplayName = displayName || appName.charAt(0).toUpperCase() + appName.slice(1)
       const realDescription = description || ''
       const logoFileName = appName + '.png';
       const logoFullPath = path.join(pathOfVersion, 'logos', logoFileName);

       if (!isLogoValid(fs, logoFullPath)) {
         const printablePath = logoFullPath.substr(logoFullPath.indexOf(`/${PUBLIC}`))
         throw new Error(`Cannot find logo for ${filename} ${printablePath}`);
       }
       console.log(`Validated ${filename}`)
      return {
        name: appName,
        displayName: realDisplayName,
        description: realDescription,
        logoUrl: logoFileName
      }
   })
   console.log(`${applicationsDetails.length} applications validated.`)
 }


try {
  return validate()
} catch(err) {
  console.error(err)
  process.exit(127)
}