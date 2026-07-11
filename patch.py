import json

app_file = 'public/locales/en/application.json'
with open(app_file, 'r') as f:
    data = json.load(f)

data['bundles']['apr_tooltip'] = "Annual percentage return"
data['bundles']['capacity_tooltip'] = "The capacity is the amount of tokens available to cover new protections"
data['bundles']['stake_usage_tooltip'] = "The stake usage shows the ratio of locked capital to supported capital"

with open(app_file, 'w') as f:
    json.dump(data, f, indent=4)

bundles_file = 'public/locales/en/bundles.json'
with open(bundles_file, 'r') as f:
    data = json.load(f)

data['stake_usage_tooltip'] = "The stake usage shows the ratio of locked capital to supported capital"

with open(bundles_file, 'w') as f:
    json.dump(data, f, indent=4)

