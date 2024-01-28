#!/bin/sh

npm install
if [[ $PULUMI_CI_STACK == pr-matt-fff-* ]]; then
  ESCENV="codefold/urlup-fe-pr"
else
  ESCENV="codefold/urlup-fe-dev"
fi

esc open $ESCENV
esc run $ESCENV npm run build

