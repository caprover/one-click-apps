## Repo for CapRover One Click Apps

To create a new one click app:
- Find/create a docker-compose file for the one click app
- Convert yaml file to json
- Copy the content into the one-click app structure. See this for the reference: [wordpress.json](https://github.com/caprover/one-click-apps/blob/master/public/v2/apps/wordpress.json)
- Variables are prefixed with `$$cap`
- Variables can be anywhere in the JSON and they will be replaced by what user enters
- There are 2 special variables called `$$cap_appname` and `$$cap_root_domain` which exist for all oneclick apps. If your app needs environment variables with the URL value of the app, you can use `$$cap_appname.$$cap_root_domain` which resolves to something like `myappname.rootdomain.com`
- Each custom variable must have `id`, `label`. They may also have `defaultValue`, `validRegex`, `description`. (NB: fields are not required. If validRegex is not set, the field can be set as empty and ignored by the user.)
- Other than `image`, `environment`, `ports`, `volumes`, `depends_on`, other parameters are currently being ignored by CapRover. Make sure they are not crucial.
- Instead of `image` property in a service, you can use `dockerfileLines` which is an array of strings.
- Some webapps, use a non-standard HTTP port. For example, Adminer's Docker image uses port 8080. In this case, add `containerHttpPort` to the service. See [adminer.json](https://github.com/caprover/one-click-apps/blob/master/public/v2/apps/adminer.json) for example.
- Add the icon as a png file to the logos directory.

## Test your One Click Apps
After creating your One-Click app json, like [this](https://github.com/caprover/one-click-apps/blob/master/public/v2/apps/adminer.json), you need to test it before creating a Pull Request. Here is how you test it:
- Login to your CapRover dashboard
- Go to **apps** and click on **One-Click Apps/Databases**
- Select **>> TEMPLATE <<** at the bottom of the dropdown list 
- Copy and paste your JSON into the text area, and click **NEXT**.
- Enter values and make sure it's working as expected.
