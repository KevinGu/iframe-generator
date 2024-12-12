#!/bin/bash

# example usage:
# ./push-to-tags.sh "Add new feature"

# Check if a commit message is provided
if [ -z "$1" ]; then
    echo "Error: Please provide a commit message"
    echo "Usage: ./push-to-tags.sh <commit-message>"
    exit 1
fi

COMMIT_MESSAGE=$1

# Add all changes
git add .

# Create commit with provided message
git commit -m "$COMMIT_MESSAGE"

# Check if tags branch exists locally
if ! git show-ref --verify --quiet refs/heads/tags; then
    # If tags branch doesn't exist, create it from main
    git checkout -b tags
else
    # If it exists locally, switch to it
    git checkout tags
fi

# 直接重置 tags 分支到 main，保持完全一致
git reset --hard main

# 强制推送到远程，确保远程 tags 也与 main 一致
git push -f origin tags

# Switch back to main branch
git checkout main

echo "Successfully pushed changes to tags branch (now identical to main)"
