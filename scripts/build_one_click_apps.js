/*jshint esversion: 6 */
const path = require('path');
const yaml = require('yaml');
const fs = require('fs-extra');

// Next, for V4:
// ============================================================================
// ============================================================================
// *********** THIS IS ONLY TO BE DONE AFTER CAPROVER 1.8 RELEASE *************
// ============================================================================
// ============================================================================
// 
// 1- DUPLICATE this script. The new script is to ONLY read from /public/v4/*.yaml
// 2- Test with a new YAML file
// 3- Write script to convert all v2 JSON to V4 yaml and place them in /public/v4/*.yaml
// 4- Update readme!!!!
// 5- Push all 3 steps above at the same time to GITHUB

const pathOfPublic = path.join(__dirname, '..', `public`);

const pathOfDist = path.join(__dirname, '..', `dist`);

const pathOfDistV2 = path.join(pathOfDist, 'v2');
const pathOfDistV3 = path.join(pathOfDist, 'v3');
const pathOfDistV4 = path.join(pathOfDist, 'v4');

const pathOfSourceDirectory = path.join(pathOfPublic, 'v2');
const pathOfSourceDirectoryApps = path.join(pathOfSourceDirectory, 'apps');
const pathOfSourceDirectoryLogos = path.join(pathOfSourceDirectory, 'logos');


function createAppList(appsList, pathOfApps) {
    const apps = appsList.filter(v => v.includes('.json'));
    const appDetails = [];

    for (var i = 0; i < apps.length; i++) {
        const contentString = fs.readFileSync(path.join(pathOfApps, apps[i]));
        const content = JSON.parse(contentString);
        const captainVersion = (content.captainVersion + '');

        apps[i] = apps[i].replace('.json', '');

        if (captainVersion + '' === '2') {
            if (!content.displayName) {
                content.displayName = apps[i];
                content.displayName = content.displayName.substr(0, 1).toUpperCase() + content.displayName.substring(1, content.displayName.length);
            }
            if (!content.description) content.description = '';

            appDetails[i] = {
                name: apps[i],
                displayName: content.displayName,
                description: content.description,
                isOfficial: `${content.isOfficial}`.toLowerCase() === 'true',
                logoUrl: apps[i] + '.png'
            };
        } else {
            throw new Error('Unknown captain-version: ' + captainVersion);
        }

    }

    return {
        appList: apps,
        appDetails: appDetails
    };
}

function convertV2toV4(v2String) {
    const parsed = JSON.parse(v2String);
    if (`${parsed.captainVersion}` !== '2') {
        throw new Error('CaptainVersion must be 2 for this conversion');
    }

    function moveProperty(propertyName) {
        parsed.caproverOneClickApp[propertyName] = parsed[propertyName];
        parsed[propertyName] = undefined;
    }

    parsed.services = parsed.dockerCompose.services;
    parsed.dockerCompose = undefined;

    parsed.captainVersion = 4;
    parsed.caproverOneClickApp = {};

    moveProperty('variables');
    moveProperty('instructions');
    moveProperty('displayName');
    moveProperty('isOfficial');
    moveProperty('description');
    moveProperty('documentation');

    Object.keys(parsed.services).forEach(serviceName => {
        const service = parsed.services[serviceName];
        if (service.containerHttpPort) {
            service.caproverExtra = service.caproverExtra || {};
            service.caproverExtra.containerHttpPort = service.containerHttpPort;
        }
        if (service.dockerfileLines) {
            service.caproverExtra = service.caproverExtra || {};
            service.caproverExtra.dockerfileLines = service.dockerfileLines;
        }
        if (service.notExposeAsWebApp) {
            service.caproverExtra = service.caproverExtra || {};
            service.caproverExtra.notExposeAsWebApp = service.notExposeAsWebApp;
        }
        service.containerHttpPort = undefined;
        service.dockerfileLines = undefined;
        service.notExposeAsWebApp = undefined;
    });

    return parsed;
}


function buildDist() {
    return Promise.resolve()
        .then(function () {
            if (!fs.existsSync(pathOfSourceDirectoryApps)) {
                return [];
            }
            return fs.readdir(pathOfSourceDirectoryApps);
        })
        .then(function (appsFileNames) { // [ app1.json app2.json .... ]

            if (appsFileNames.length === 0) {
                return;
            }

            appsFileNames.forEach(appFileName => {
                const pathOfAppFileInSource = path.join(pathOfSourceDirectoryApps, appFileName);

                //v2
                fs.copySync(pathOfAppFileInSource, path.join(pathOfDistV2, `apps`, appFileName));

                //v3
                fs.copySync(pathOfAppFileInSource, path.join(pathOfDistV3, `apps`, appFileName.split('.')[0]));

                //v4
                const contentString = fs.readFileSync(pathOfAppFileInSource);
                fs.outputJsonSync(path.join(pathOfDistV4, `apps`, appFileName.split('.')[0]), convertV2toV4(contentString));
            });

            fs.copySync(pathOfSourceDirectoryLogos, path.join(pathOfDistV2, `logos`));
            fs.copySync(pathOfSourceDirectoryLogos, path.join(pathOfDistV3, `logos`));
            fs.copySync(pathOfSourceDirectoryLogos, path.join(pathOfDistV4, `logos`));

            const allAppsList = createAppList(appsFileNames, pathOfSourceDirectoryApps);
            const v3List = {
                oneClickApps: allAppsList.appDetails
            };
            fs.outputJsonSync(path.join(pathOfDistV2, 'autoGeneratedList.json'), allAppsList);
            fs.outputJsonSync(path.join(pathOfDistV2, 'list'), v3List); // TODO delete oneClickApps: 
            fs.outputJsonSync(path.join(pathOfDistV3, 'list'), v3List);
            fs.outputJsonSync(path.join(pathOfDistV4, 'list'), v3List);
            return fs.copySync(path.join(pathOfPublic, 'CNAME'), path.join(pathOfDist, 'CNAME'));
        });
}


Promise.resolve()
    .then(function () {
        return buildDist();
    })
    .catch(function (err) {
        console.error(err);
        process.exit(127);
    });