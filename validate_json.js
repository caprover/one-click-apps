/*jshint esversion: 6 */
const path = require('path')
const fs = require('fs-extra')

const PUBLIC = 'public'
const pathOfPublic = path.join(__dirname, PUBLIC)
const VERSION = 2
const LOGO_EXTENSION = '.png'
const ONE_APP_EXTENSION = '.json'
const APP_FOLDER = 'apps'
const LOGO_FOLDER = 'logos'

const isLogoValid = ({ existsSync, statSync }, logoFullPath) => existsSync(logoFullPath) && statSync(logoFullPath).isFile()
const isVersionValid = (applicationVersion, capVersion) => applicationVersion === capVersion
const versionErrorDisplay = (appVersion, capVersion, filename) => `unmatched versions ${appVersion} ${capVersion} for ${filename}`
const logoErrorDisplay = (filename, logoFullPath) =>`Cannot find logo for ${filename} ${printablePath(logoFullPath)}`
const printablePath = fullPath => fullPath.substr(fullPath.indexOf(`/${PUBLIC}`))
const defaultDisplayName = appName => appName.charAt(0).toUpperCase() + appName.slice(1)
const endDisplay = appNumber => `${appNumber} applications validated.`

 // validating version 2
 async function validate() {
     const pathOfVersion = path.join(pathOfPublic, 'v' + VERSION)
     const pathOfApps = path.join(pathOfVersion, APP_FOLDER)
     const versionString = VERSION + ''
     const files = await fs.readdir(pathOfApps)
     const apps = files.filter(fileName => fileName.includes(ONE_APP_EXTENSION))

     const applicationsDetails = apps.map(filename => {
      const contentString = fs.readFileSync(path.join(pathOfApps, filename))
      const appName = filename.replace(ONE_APP_EXTENSION, '')
      const {
        captainVersion: appVersion,
        displayName = defaultDisplayName(appName),
        description = ''
      } = JSON.parse(contentString)
      if (!isVersionValid(appVersion, versionString)) {
        throw new Error(versionErrorDisplay(appVersion, versionString, filename))
      }
      const logoFileName = appName + LOGO_EXTENSION
      const logoFullPath = path.join(pathOfVersion, LOGO_FOLDER, logoFileName)

       if (!isLogoValid(fs, logoFullPath)) {
         throw new Error(logoErrorDisplay(filename, logoFullPath))
       }
       console.log(`Validated ${filename}`)
        return {
          name: appName,
          displayName,
          description,
          logoUrl: logoFileName,
          logoFullPath
        }
      })
    console.log(endDisplay(applicationsDetails.length))
 }

try {
  return validate()
} catch(err) {
  console.error(err)
  process.exit(127)
}
