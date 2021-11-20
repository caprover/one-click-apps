## Repo for CapRover One Click Apps

### How to create a one-click app (as of v1.8.0):
First, have a look at [this simple example](https://github.com/caprover/one-click-apps/blob/master/public/v4/apps/privatebin.yml). Now, read on for more details:


- Find/create a docker-compose file for the app you're interested in.
- Add `captainVersion: 4` to the very top of the yaml file.
- Add this section to the end of the yaml file:
```yaml
caproverOneClickApp:
    variables:
        - id: '$$cap_myapp_version'
          label: Awesome App Version
          defaultValue: '1.2.3'
          description: Check out their Docker page for the valid tags https://hub.docker.com/r/....../tags
          validRegex: "/.{1,}/"
    instructions:
        start: |-
            A description that will be displayed to the user when they
            are installing one click app!
            It can be multiline and contain more details and probably special
            hardware requirements!
        end: |-
            A summary when the app is deployed!
            It can be multiline.

            It can also include the dynamic parameters such as
            $$cap_appname and $$cap_other_random_char
    displayName: The Awesome App
    isOfficial: true ## Only if all images used here are official or from a trusted source.
    description: A relatively short description, less than 200 characters.
    documentation: This docker-compose is taken from example.com
```

### Variables:
- Variables are prefixed with `$$cap`
- Variables can be anywhere in the content and they will be replaced by what user enters
- There are 3 special variables that are built-in for all oneclick apps: `$$cap_appname`, `$$cap_root_domain`, and `$$cap_gen_random_hex(length)`. For example, if your app needs environment variables with the URL value of the app, you can use `$$cap_appname.$$cap_root_domain` which resolves to something like `myappname.rootdomain.com`. Also If you need a default password, you can use `$$cap_gen_random_hex(10)`
- Each custom variable must have `id`, `label`. They could also have `defaultValue`, `validRegex`, `description`.
- IMPORTANT: by default, fields are not required to be filled. If validRegex is not set, the field can be set as empty and ignored by the user.


### Services:
- Other than `image`, `environment`, `ports`, `volumes`, `depends_on`, and `hostname`, other parameters are currently being ignored by CapRover. If you need a particular parameter, please file an issue, and we'll add it to the respected list.
- Services have a special subsection specific to CapRover called `caproverExtra` which contains service specific parameters that are only available via CapRover and not docker compose. Currently this field can take the following variables:
    - `dockerfileLines` which is a multiline variable, and can be used instead of `image` property in the service. You must delete the `image` property if you want to use this parameter.
    - `containerHttpPort` is useful when the underlying service uses a custom port for HTTP. If not provided, the default will be `"80"`
    - `notExposeAsWebApp` can be set to `"true"` when the underlying service is not an HTTP app. This is useful for databases and other internally used services.

### Icon
- Make sure you add an app icon to the logos directory!


---------


## Test your One Click Apps
After creating your One-Click app yaml file, you need to test it before creating a Pull Request. Here is how you test it:
- Login to your CapRover dashboard
- Go to **apps** and click on **One-Click Apps/Databases**
- Select **>> TEMPLATE <<** at the bottom of the dropdown list 
- Copy and paste your YAML into the text area, and click **NEXT**.
- Enter values and make sure it's working as expected.

---------

## Build your own one-click app repository
You may want to build your own private repository. CapRover supports having multiple repositories. You can add new repository URLs to the one click app page. The official one, this one, is available as `https://oneclickapps.caprover.com`.

To create your own repository:
- Fork this repository
- Delete all existing apps (to avoid duplicate apps), and add your own apps.
- Run `npm i`
- Run `npm run validate_apps` 
- Run `npm run build` 
- Now you can host the static content placed in `./dist` directory anywhere you want, the official repo uses github pages to publish the content. Make sure to update [CNAME](https://github.com/caprover/one-click-apps/blob/master/public/CNAME) to your own URL if you decide to do so.

Here is a good example: [Skayo's CapRover One-Click-Apps](https://github.com/Skayo/CapRover-One-Click-Apps)
