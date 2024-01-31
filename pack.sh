#!/bin/bash

INCLUDE=("icons" "background.js" "content.js" "manifest.json")

zip -r job_snap.zip "${INCLUDE[@]}"
