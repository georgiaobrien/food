# Food Champion lookup project

This is the skeleton of the code for the food champion project

## Setup 

- (via a webserver) open the file index.html

### Docker setup

- Run `docker-compose up` and access the page at http://localhost:8000/index.html

#### Generate json with data

* Go to https://www.convertcsv.com/csv-to-json.htm
* Copy the csv data that has the council data
* On "Step 5: Generate output", choose "CVS to Keyed JSON"
* Copy the generated JSON into the file called council_data.json 

## Run

Open the form and test it with the following postcodes: 



* `DD1 1JB`   Scotland postcode 

* `aaaaaa`  Wrong postcode

* `LL23 7DD`  Wales postcode

* `IG11 0AG` Postcode that is in England, mapit knows it, but for which you have no data at all

* `EN4 0BE` Postcode that is in England, [it is valid](https://www.doogal.co.uk/ShowMap.php?postcode=EN4%200BE), but mapit doesn't know it

* `BL1 1RU` ~~Postcode where the council name does not match the one from the dummy data~~

* `SW1A1AA` Westminster City Council postcode (Champion: No , Food partnership: Yes)

* `BL1 1RU` Bolton Borough Council postcode (Champion: Yes , Food partnership: No)

* `SL1 2EL` Slough Borough Council  (Champion: Yes , Food partnership: Uknown)

* `YO1 6GA` Test with City of York Council (Champion: Yes , Food partnership: Yes)

