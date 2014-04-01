 /    \ / _` | |/ /  / _ \| '_ \| __| '__/ _ \| |
/ /\/\ \ (_| | / /__| (_) | | | | |_| | | (_) | |
\/    \/\__,_|_\____/\___/|_| |_|\__|_|  \___/|_|
                                                 

Gathering open data from malware analysis websites is the main target of Malware Control Monitor project.
Visualize such a data by synthesize statistics highlighting where threats happen and what their impact is, could be useful to identify malware propagations 

## Badg Mania
[![lib status](https://david-dm.org/marcoramilli/malcontrol.png)](https://david-dm.org/marcoramilli/malcontrol)
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/marcoramilli/malcontrol/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
[![Support Marco via Gittip](http://img.shields.io/gittip/marco.svg)](https://www.gittip.com/marco/)
[![Support Lorenzo via Gittip](http://img.shields.io/gittip/zoff.svg)](https://www.gittip.com/zoff/)
[![GitHub version](https://badge.fury.io/gh/marcoramilli%2Fmalcontrol.png)](http://badge.fury.io/gh/marcoramilli%2Fmalcontrol)
![Code ship](https://www.codeship.io/projects/b4cc96a0-8a8c-0131-3e1f-5a175932ae46/status)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## Open Data
We actually scrape the following services:

1. [malwr](http://malwr.com)
2. [phishtank](http://www.phishtank.com/)
3. [urlquery](http://urlquery.net/)
4. [virscan](http://www.virscan.org/)
5. [webinspector](http://app.webinspector.com/recent_detections)

If **you are a malware scan provider and you would like to actively  partecipate to the project by giving some of your data, please contact us, we'll be glad to add your service to our project**.
Each visualized threat comes with the original and 'clickable' URL pointing to the original report. The original report owns all the specific information to the threat.

## Backend Structure

A backround node scrapes websites to grab malware informations and fills up a mongod database. An API node serves API useful to frontend layer. Public API are available, please read doc/index.html for a full list of API. If you are interested on developing a website scraper take as example one of the scrapers available into the scrapers folder. Each scraper must be a function 'goScraper' ending-up saving scraped data to db using the functionsaveMalwareToDB respecting the db schema placed into schemas/ 

## Visualization

A short description on visualization layer can be found here.

## Screenshots
Screenshots talk laudly :)

## Open API 
Please refer to doc section for a fully documented Public API

![under construction](http://www.dmcc.it/chris/matchable/data/images/under_construction.jpeg)

