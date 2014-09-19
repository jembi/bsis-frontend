#!/bin/bash

SOURCEDIR="<%= @source_dir %>"

cd $SOURCEDIR;
bower update --allow-root --force
git pull && puppet apply infrastructure/deployment/env/bsis-frontend.pp