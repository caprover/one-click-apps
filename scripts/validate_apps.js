const path = require('path')
const yaml = require('yaml')
const fs = require('fs-extra')

function validateApp(version, filename) {
    const appsDir = path.join(__dirname, '..', 'public', version, 'apps')
    const logosDir = path.join(__dirname, '..', 'public', version, 'logos')
    // v5 initially contains copies of the v4 templates.
    const captainVersions = version === 'v4' ? ['4'] : ['4', '5']

    if (!filename.endsWith('.yml')) {
        throw new Error(
            `All files in ${version} must end with .yml: ${filename}`
        )
    }

    const name = path.basename(filename, '.yml')
    const app = `${version}/${name}`
    const template = yaml.parse(
        fs.readFileSync(path.join(appsDir, filename), 'utf-8')
    )

    if (!captainVersions.includes(String(template.captainVersion))) {
        throw new Error(
            `Expected captainVersion ${captainVersions.join(' or ')} for ${app}`
        )
    }

    const metadata = template.caproverOneClickApp
    if (!metadata) {
        throw new Error(`Cannot find caproverOneClickApp for ${app}`)
    }
    if (!metadata.description) {
        throw new Error(`Cannot find description for ${app}`)
    }
    if (metadata.description.length > 200) {
        throw new Error(`Description too long for ${app} - max 200 chars`)
    }
    if (!metadata.instructions?.start || !metadata.instructions?.end) {
        throw new Error(
            `Cannot find instructions.start or instructions.end for ${app}`
        )
    }
    if (!template.services) {
        throw new Error(`Cannot find services for ${app}`)
    }

    const logoPath = path.join(logosDir, name + '.png')
    if (!fs.existsSync(logoPath) || !fs.statSync(logoPath).isFile()) {
        throw new Error(`Cannot find logo for ${app}: ${logoPath}`)
    }

    console.log(`Validated ${app}`)
}

try {
    for (const version of ['v4', 'v5']) {
        const appsDir = path.join(__dirname, '..', 'public', version, 'apps')
        for (const filename of fs.readdirSync(appsDir)) {
            validateApp(version, filename)
        }
    }
} catch (err) {
    console.error(err)
    process.exit(127)
}
