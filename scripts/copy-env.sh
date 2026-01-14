#!/bin/bash

# Script to copy .env.local from main project to current worktree
# This is useful when working with Zenflow worktrees that need Sanity CMS environment variables

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKTREE_DIR="$(dirname "$SCRIPT_DIR")"

# Get the main git directory from .git file
if [ -f "$WORKTREE_DIR/.git" ]; then
    MAIN_GIT_DIR=$(cat "$WORKTREE_DIR/.git" | grep "gitdir:" | cut -d' ' -f2 | sed 's|/.git/worktrees/.*||')
    
    if [ -f "$MAIN_GIT_DIR/.env.local" ]; then
        echo "Copying .env.local from main project to current worktree..."
        cp "$MAIN_GIT_DIR/.env.local" "$WORKTREE_DIR/.env.local"
        echo "✓ .env.local copied successfully"
    else
        echo "✗ .env.local not found in main project at: $MAIN_GIT_DIR"
        exit 1
    fi
else
    echo "✗ Not in a git worktree. This script is designed for Zenflow worktrees."
    exit 1
fi
