#!/bin/sh

npm install
if [[ $PULUMI_CI_STACK == pr-matt-fff-* ]]; then
  ESCENV="codefold/urlup-fe-pr"
else
  ESCENV="codefold/urlup-fe-dev"
fi

if pulumi login > /dev/null 2>&1; then
    echo "Logged into pulumi successfully."
else
    echo "Failed to login to Pulumi."
    exit 1
fi

if pulumi env open $ESCENV > /dev/null 2>&1; then
    echo "Pulumi env opened successfully."
else
    echo "Failed to open Pulumi env."
    exit 1
fi

pulumi env run $ESCENV npm run build

