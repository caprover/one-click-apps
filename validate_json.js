/*jshint esversion: 6 */
// Requirements
const path = require('path')
const fs = require('fs-extra')

const PUBLIC = 'public'
const pathOfPublic = path.join(__dirname, PUBLIC)
const VERSION = 2
const LOGO_EXTENSION = '.png'
const ONE_APP_EXTENSION = '.json'
const APP_FOLDER = 'apps'
const LOGO_FOLDER = 'logos'

// VALIDATION functions
const isLogoValid = ({ existsSync, statSync }, logoFullPath) => existsSync(logoFullPath) && statSync(logoFullPath).isFile()
const isVersionValid = (applicationVersion, capVersion) => applicationVersion === capVersion

// Displayed Messages
const printablePath = fullPath => fullPath.substr(fullPath.indexOf(`/${PUBLIC}`))
const versionErrorMessage = (appVersion, capVersion, filename) => `unmatched versions ${appVersion} ${capVersion} for ${filename}`
const logoErrorMessage = (filename, logoFullPath) =>`Cannot find logo for ${filename} ${printablePath(logoFullPath)}`
const defaultDisplayName = appName => appName.charAt(0).toUpperCase() + appName.slice(1)
const endMessage = appNumber => `${appNumber} applications validated.`
const validatedMessage = filename => `Validated ${filename}`

const DISPLAY = {
  ERROR: {
    LOGO: logoErrorMessage,
    VERSION: versionErrorMessage,
  },
  LOG: {
    END: endMessage,
    VALIDATED: validatedMessage,
  },
}

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
      description = '',
    } = JSON.parse(contentString)
    if (!isVersionValid(appVersion, versionString)) {
      throw new Error(DISPLAY.ERROR.VERSION(appVersion, versionString, filename))
    }

    const logoFileName = appName + LOGO_EXTENSION
    const logoFullPath = path.join(pathOfVersion, LOGO_FOLDER, logoFileName)
    if (!isLogoValid(fs, logoFullPath)) {
      throw new Error(DISPLAY.ERROR.LOGO(filename, logoFullPath))
    }
    console.log(DISPLAY.LOG.VALIDATED(filename))
    return { name: appName, displayName, description, logoUrl: logoFileName, logoFullPath }
  })
  console.log(DISPLAY.LOG.END(applicationsDetails.length))
}

try {
  return validate()
} catch(err) {
  console.error(err)
  process.exit(127)
}
