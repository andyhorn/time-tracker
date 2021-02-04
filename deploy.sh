#!/usr/bin/env sh

# Abort on errors
set -e

# Create a new, temporary branch called 'gh-pages'
git checkout --orphan gh-pages

# Build the production app
npm run build

# Set the 'dist' folder as the root working tree,
# commit all files, and push to the 'gh-pages'
# branch on the GitHub repo
git --work-tree dist add --all
git --work-tree dist commit -m "Deploy"
git push origin HEAD:gh-pages --force

# Remove the local 'dist' folder containing 
# the production optimized app
rm -r dist

# Checkout the master branch
git checkout -f master

# Remove the temporary 'gh-pages' branch
git branch -D gh-pages
