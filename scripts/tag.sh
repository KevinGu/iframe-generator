#!/bin/bash

# example usage:
# ./tag.sh "v1.0.0"
# Check if a tag name is provided
if [ -z "$1" ]; then
    echo "Error: Please provide a tag name"
    echo "Usage: ./tag.sh <tag-name>"
    exit 1
fi

TAG_NAME=$1

# Add all changes
git add .

# Commit changes with tag name as message
git commit -m "Release $TAG_NAME"

# Create and push tag
git tag -a "$TAG_NAME" -m "Release $TAG_NAME"
git push origin main
git push origin "$TAG_NAME"

echo "Successfully created and pushed tag: $TAG_NAME"
