#!/bin/bash

# FROM:  https://raw.githubusercontent.com/maxheld83/ghpages/master/LICENSE
# MIT License

# Copyright (c) 2019 Maximilian Held

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.


set -e

BUILD_DIR=dist
SOURCE_DIRECTORY_DEPLOY_GH=~/temp-gh-deploy-src
CLONED_DIRECTORY_DEPLOY_GH=~/temp-gh-deploy-cloned

echo "#############################################" 
echo "######### making directories" 
echo "######### $SOURCE_DIRECTORY_DEPLOY_GH" 
echo "######### $CLONED_DIRECTORY_DEPLOY_GH" 
echo "#############################################" 

mkdir -p $SOURCE_DIRECTORY_DEPLOY_GH
mkdir -p $CLONED_DIRECTORY_DEPLOY_GH

echo "#############################################" 
echo "######### Setting env vars" 
echo "#############################################" 

REMOTE_REPO="https://${GITHUB_PERSONAL_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
REPONAME="$(echo $GITHUB_REPOSITORY| cut -d'/' -f 2)"

OWNER="$(echo $GITHUB_REPOSITORY| cut -d'/' -f 1)" 
GHIO="${OWNER}.github.io"
if [[ "$REPONAME" == "$GHIO" ]]; then
  REMOTE_BRANCH="master"
else
  REMOTE_BRANCH="gh-pages"
fi 
sleep 1s
echo "#############################################" 
echo "######### CLONING REMOTE_BRANCH: $REMOTE_BRANCH" 
echo "#############################################" 


cp -r $BUILD_DIR $SOURCE_DIRECTORY_DEPLOY_GH/
git clone --single-branch --branch=$REMOTE_BRANCH $REMOTE_REPO $CLONED_DIRECTORY_DEPLOY_GH
sleep 1s
echo "#############################################" 
echo "######### Removing old files" 
echo "#############################################" 
cd $CLONED_DIRECTORY_DEPLOY_GH && git rm -rf . && git clean -fdx 
sleep 1s
echo "#############################################" 
echo "######### Copying files" 
echo "#############################################" 
cp -r $SOURCE_DIRECTORY_DEPLOY_GH/$BUILD_DIR $CLONED_DIRECTORY_DEPLOY_GH/$BUILD_DIR 
mv $CLONED_DIRECTORY_DEPLOY_GH/.git $CLONED_DIRECTORY_DEPLOY_GH/$BUILD_DIR/ 
cd $CLONED_DIRECTORY_DEPLOY_GH/$BUILD_DIR/ 
sleep 1s
echo "#############################################" 
echo "######### Content pre-commit ###" 
echo "#############################################" 
ls -la
echo "#############################################" 
echo "######### Commit and push ###" 
echo "#############################################" 
sleep 1s
git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
echo `date` >> forcebuild.date
git add -A 
git commit -m 'Deploy to GitHub Pages' 
git push $REMOTE_REPO $REMOTE_BRANCH:$REMOTE_BRANCH 