# regulation

### დეველოპერებს
#### Docker კონტეინერი (elasticsearch)
https://www.docker.elastic.co/

```
docker run --name regulation -p 9200:9200 -itd docker.elastic.co/elasticsearch/elasticsearch:6.2.2
```

#### პირველადი სატესტო მონაცემების ჩაწერა ბაზაში (Test Data)
```
node api/seedtestdata.js
```
