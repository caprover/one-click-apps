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
          validRegex: '/.{1,}/'
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
Even though, the format used by One Click apps is Docker Compose, not all parameters defined in Docker Compose file are parsed out by CapRover. Only the following parameters are used:
- `image`
- `environment`
- `ports`
- `volumes`
- `depends_on`
- `hostname`
- `command`
- `cap_add`

Other parameters are currently being ignored by CapRover. If you need a particular parameter, please file an issue, and we'll add it to the respected list.

Aside the the Docker Compose template, services have a special subsection specific to CapRover called `caproverExtra` which contains service specific parameters that are only available via CapRover and not docker compose. Currently this field can take the following variables:
- `dockerfileLines` which is a multiline variable, and can be used instead of `image` property in the service. You must delete the `image` property if you want to use this parameter. NOTE: `dockerfileLines` should be used in rare cases where other methods cannot work. Prefer `command` where possible. 
- `containerHttpPort` is useful when the underlying service uses a custom port for HTTP. If not provided, the default will be `"80"`
- `notExposeAsWebApp` can be set to `"true"` when the underlying service is not an HTTP app. This is useful for databases and other internally used services.
- `websocketSupport` can be set to `"true"` to automatically enable Websocket Support. Only supported in versions 1.12+

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
- Run `npm run formatter-write`
- Run `npm run build`
- Now you can host the static content placed in `./dist` directory anywhere you want, the official repo uses [github pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) to publish the content. Make sure to update [CNAME](https://github.com/caprover/one-click-apps/blob/master/public/CNAME) to your own URL if you decide to do so.
 
### Hosting your own repository on a CapRover instance
Your own private repository can be hosted on a CapRover instance with the newly-added [captain-definition](/captain-definition) file.

To set up your private repository on CapRover:
- Follow the above steps to create your own repository. Update your fork from the upstream master branch if you don't have `captain-definition` in your fork's root directory
- In your CapRover dashboard, go to **apps**. Under **Create A New App**, name it something relevant such as `caprover-apps`, leave the **Has Persistent Data** checkbox unchecked, and click Create New App.
- In the new app, go to **Deployment**, scroll down to **Method 3: Deploy from Github/Bitbucket/Gitlab**, put the Git url for your forked repository and other requested data, click **Save and Update**, and then **Force Build**.
  - Alternatively, an instance of your private repository can be created by making a tarball (`.tar`) of the contents of the one-click-apps repo and uploading it under **Method 2: Tarball**.
- Check that the domain listed under HTTP Settings shows the `Welcome to nginx!` page.
- You should be able to add another domain to this CapRover site, and add it as a third party repository using the below instructions.

### Third party One Click Apps

In order to add a third party repository:
-   Login to your CapRover dashboard
-   Go to **apps** and click on **One-Click Apps/Databases** and scrolldown to the bottom
-   Under **3rd party repositories:** copy  the URL, (for example: `https://Awes0meHub.github.io/caprover-one-click-apps`) and paste it in to the text box
-   Click the **_Connect New Repository_** button

#### 3rd party repositories
-   Awes0meHub: [Github](https://github.com/caproverhub/caprover-one-click-apps) repository: `https://caproverhub.github.io/caprover-one-click-apps`
-   Jordan-hall: [Github](https://github.com/Jordan-Hall/caprover-one-click-apps) repository: `https://oneclickapps.libertyware.io`
