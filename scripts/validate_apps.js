const path = require('path')
const yaml = require('yaml')
const fs = require('fs-extra')

const appsDir = path.join(__dirname, '..', 'public', 'v4', 'apps')
const logosDir = path.join(__dirname, '..', 'public', 'v4', 'logos')

function validateApp(filename) {
    if (!filename.endsWith('.yml')) {
        throw new Error(`All files in v4 must end with .yml: ${filename}`)
    }

    const name = path.basename(filename, '.yml')
    const template = yaml.parse(
        fs.readFileSync(path.join(appsDir, filename), 'utf-8')
    )

    if (String(template.captainVersion) !== '4') {
        throw new Error(`Expected captainVersion 4 for ${name}`)
    }

    const metadata = template.caproverOneClickApp
    if (!metadata) {
        throw new Error(`Cannot find caproverOneClickApp for ${name}`)
    }
    if (!metadata.description) {
        throw new Error(`Cannot find description for ${name}`)
    }
    if (metadata.description.length > 200) {
        throw new Error(`Description too long for ${name} - max 200 chars`)
    }
    if (!metadata.instructions?.start || !metadata.instructions?.end) {
        throw new Error(
            `Cannot find instructions.start or instructions.end for ${name}`
        )
    }
    if (!template.services) {
        throw new Error(`Cannot find services for ${name}`)
    }

    const logoPath = path.join(logosDir, name + '.png')
    if (!fs.existsSync(logoPath) || !fs.statSync(logoPath).isFile()) {
        throw new Error(`Cannot find logo for ${name}: ${logoPath}`)
    }

    console.log(`Validated ${name}`)
}

try {
    for (const filename of fs.readdirSync(appsDir)) {
        validateApp(filename)
    }
} catch (err) {
    console.error(err)
    process.exit(127)
}
