First of all, thank you for your contribution! 😄

Please note that this repo is mostly for popular apps with thousands of stars and tens of thousands of downloads. If you'd like to add a less popular app, you can always [create your own 3rd party repo](https://github.com/caprover/one-click-apps#build-your-own-one-click-app-repository) and add your app there.


### ☑️ Self Check before Merge

- [ ] I have tested the template using the method described in README.md thoroughly
- [ ] I have ensured that I put as much default values as possible (except passwords) to ensure minimum effort required for end users to get started.
- [ ] I have ensured that I am not using the "latest" tag as this tag is dynamically changing and might break the one-click app. Use a fixed version.
- [ ] I have made sure that instructions.start and instructions.end are clear and self-explanatory.
- [ ] Icon is added as a png file to the logos directory.
- [ ] I've executed the checks if necessary by running `npm ci && npm run validate_apps && npm run formatter` (If failling run the prettier: `npm run formatter-write`)
- [ ] I will take responsibility addressing any issues that arises as a result of this PR (maintaining this app).
