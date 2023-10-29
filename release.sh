#!/bin/bash

# required packages (for ubuntu:kinetic): curl git jq nodejs npm

if [ -z "$RELEASE_NPM_TOKEN" ]; then
  echo No npm token specified for publishing to npmjs.com. Stopping release.
  exit 1
fi
export RELEASE_BRANCH=${GITHUB_REF_NAME:-main}
if [ ! -v RELEASE_USER ]; then
  export RELEASE_USER=$GITHUB_ACTOR
fi
RELEASE_GIT_NAME=$(curl -s https://api.github.com/users/$RELEASE_USER | jq -r .name)
RELEASE_GIT_EMAIL=$RELEASE_USER@users.noreply.github.com

# RELEASE_VERSION can be a version number (exact) or increment keyword (next in sequence)
if [ -z "$RELEASE_VERSION" ]; then RELEASE_VERSION=prerelease; fi
if [ -z "$RELEASE_NPM_TAG" ]; then
  if case $RELEASE_VERSION in major|minor|patch) ;; *) false;; esac; then
    RELEASE_NPM_TAG=latest
  elif case $RELEASE_VERSION in pre*) ;; *) false;; esac; then
    RELEASE_NPM_TAG=testing
  elif [ "$RELEASE_VERSION" != "${RELEASE_VERSION/-/}" ] && [ "${RELEASE_VERSION#*-}" != "stable" ]; then
    RELEASE_NPM_TAG=testing
  else
    RELEASE_NPM_TAG=latest
  fi
fi

# configure git to push changes
git config --local user.name "$RELEASE_GIT_NAME"
git config --local user.email "$RELEASE_GIT_EMAIL"

# configure npm client for publishing
echo -e "//registry.npmjs.org/:_authToken=$RELEASE_NPM_TOKEN" > $HOME/.npmrc

# release!
(
  set -e
  npm version --no-git-tag-version $RELEASE_VERSION
  RELEASE_VERSION=$(npm exec -c 'echo -n $npm_package_version')
  if case $RELEASE_VERSION in 1.0.0-*) ;; *) false;; esac; then
    RELEASE_NPM_TAG=latest
  fi
  git commit -a -m "release $RELEASE_VERSION [no ci]"
  git tag -m "version $RELEASE_VERSION" v$RELEASE_VERSION
  git push origin $(git describe --tags --exact-match)
  npm publish --access public --tag $RELEASE_NPM_TAG
  git push origin $RELEASE_BRANCH
)

exit_code=$?

# nuke npm settings
rm -f $HOME/.npmrc

# check for any uncommitted files
git status -s -b

exit $exit_code
