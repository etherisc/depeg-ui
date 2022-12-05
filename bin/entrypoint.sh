#!/bin/sh

# dump all env variables for next.js to .env.production file
env | grep '^NEXT_PUBLIC' > .env.production
echo '.env.production contents'
cat .env.production

# now start next.js server
node server.js
