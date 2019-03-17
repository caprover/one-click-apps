Steps for creating a Pull Request

See README.md to learn how to create a one-click app json file

Make sure it's fully tested using the methods mentioned in readme

Put as much default values as possible (except passwords) to ensure minimum effort required

Avoid using "latest" docker tag at it's a rolling tag and things might change with latest tag. We want to ensure a predictable output. Users can edit the tag if they want, but the default should be pointing to a fixed version.

