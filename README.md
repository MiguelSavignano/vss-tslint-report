# TSLint report

Pretty tslint result in your azure pipeline

![tslint-report example](test/examples/tslint-report.jpeg)

Save report as azure artifacts.

![tslint-report artifact](test/examples/tslint-report-artifact.png)

## Configure

Run your tslint

```
tslint -c tslint.json -t json --out tslint-result.json 'src/**/*.ts'
```
