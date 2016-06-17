# node-chart-server
Just a sandbox project ne testing with NodeJS, jsdom, D3, and express.

## How to build and run
```bash
npm install
node bin/www
```

## Endpoints
GET `<host:port>/charts`
### Pie
- type
	`chart.pie`
- data

	```
		[{
			"label": "Lurem",
			"val": 23
		}, {
			"label": "Ipsum",
			"val": 40
		}, {
			"label": "Foo",
			"val": 50
		}]
	```
	
### Bar (Vertical | Horizontal)
- type
	`chart.bar-simple-v` or `chart.bar-simple-h`
- data

	```
		[{
			"label": "01/05/2016",
			"hits": 30
		}, {
			"label": "01/28/2016",
			"hits": 20
		}, {
			"label": "02/18/2016",
			"hits": 42
		}]
	```

## License
The MIT License (MIT)

Copyright (c) 2016 deubaka (Deuphil Kaufmann)