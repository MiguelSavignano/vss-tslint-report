(cd buildAndReleaseTask && npm run build:ts)
node vmanage.js ./vss-extension.json
tfx extension create --manifest-globs vss-extension.json
