## Repo for CapRover One Click Apps

Process:
- Find/create a docker-compose file for the one click app
- Convert yaml file to json
- Copy the content into the structure as [wordpress.json](https://github.com/githubsaturn/testing-v1-one-click-apps/blob/master/one-click-apps/v1/wordpress.json)
- Variables are prefixed with `$$cap`
- There is one special variable called `$$cap_appname` which exists for all oneclick apps
- Varibles can be anywhere in the JSON and they will be replaced by what user enters
- Each variable must have `id`, `label`. It may also have `defaultValue`, `validRegex`, `description`.
- Other than `image`, `environment`, `ports`, `volumes`, `depends_on`, other parameters are ignored. Make sure they are not important.
- Instead of image in a service, you can use `dockerfileLines` which is an array of strings.
- Some webapps, use a non-standard HTTP port. For example, Adminer's Docker image uses port 8080. In this case, add `containerHttpPort` to the service. See [adminer.json](https://github.com/caprover/one-click-apps/blob/master/v1/apps/adminer.json) for example.
