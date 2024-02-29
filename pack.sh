#!/bin/bash

INCLUDE=("icons" "js" "manifest.json")

cd ./dist || exit 1

zip -r ../job_snap.zip "${INCLUDE[@]}"
