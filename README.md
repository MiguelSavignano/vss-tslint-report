# TSLint report

Pretty tslint result in your azure pipeline

![tslint-report example](https://raw.githubusercontent.com/MiguelSavignano/vss-tslint-report/master/images/tslint-report.jpeg)

Save report as azure artifacts.

![tslint-report artifact](https://raw.githubusercontent.com/MiguelSavignano/vss-tslint-report/master/images/tslint-report-artifact.png)

## Run tslint

Run tslint command before this task.

```
tslint -c tslint.json -t json --out tslint-result.json 'src/**/*.ts'
```
