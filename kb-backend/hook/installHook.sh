#!/bin/bash

# The name of your hook script, adjust as necessary
HOOK_SCRIPT_NAME="post-merge"

# Path to the hook script relative to this install script
# Update this if your post-merge script is located elsewhere
RELATIVE_HOOK_SCRIPT_PATH="${HOOK_SCRIPT_NAME}"

# Finding the root directory of the Git repository
REPO_ROOT=$(git rev-parse --show-toplevel)
if [ $? -ne 0 ]; then
    echo "Error: This script must be run within a Git repository."
    exit 1
fi

# Full path to the hook script
HOOK_SCRIPT="${RELATIVE_HOOK_SCRIPT_PATH}"

# Destination directory for the hook script
DEST_DIR="${REPO_ROOT}/.git/hooks"

# Check if hook script exists
if [ ! -f "${HOOK_SCRIPT}" ]; then
    echo "Error: Hook script '${HOOK_SCRIPT}' not found."
    exit 1
fi

# Copy the hook script to the hooks directory and make it executable
cp "${HOOK_SCRIPT}" "${DEST_DIR}/${HOOK_SCRIPT_NAME}"
chmod +x "${DEST_DIR}/${HOOK_SCRIPT_NAME}"

echo "Post-merge hook installed successfully."

