

## Info and questions
If you ha e questions and/or you need more infos on the project, pelaste contatto marcoramilli.com (marcoramilli.blogspot.com).
From 01/01/2015 the project is part of broader YORI srl Project !
<img src="http://www.yoroi.company/images/logo.svg" alt="Drawing" style="width: 50px;"/>


## Background

Gathering open data from malware analysis websites is the main target of Malware Control Monitor project.
Visualize such a data by synthesize statistics highlighting where threats happen and what their impact is, could be useful to identify malware propagations 

## Badg Mania
[![lib status](https://david-dm.org/marcoramilli/malcontrol.png)](https://david-dm.org/marcoramilli/malcontrol)
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/marcoramilli/malcontrol/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
[![Support Marco via Gittip](http://img.shields.io/gittip/marco.svg)](https://www.gittip.com/marco/)
[![Support Lorenzo via Gittip](http://img.shields.io/gittip/zoff.svg)](https://www.gittip.com/zoff/)
[![GitHub version](https://badge.fury.io/gh/marcoramilli%2Fmalcontrol.png)](http://badge.fury.io/gh/marcoramilli%2Fmalcontrol)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## Open Data
We actually scrape the following services:

1. [malwr](http://malwr.com)
2. [phishtank](http://www.phishtank.com/)
3. [urlquery](http://urlquery.net/)
4. [virscan](http://www.virscan.org/)
5. [webinspector](http://app.webinspector.com/recent_detections)
6. [domainlist](http://www.malwaredomainlist.com/)
7. [malc0de](http://malc0de.com/)
8. [vxvault](http://vxvault.siri-urz.net/)

If **you are a malware scan provider and you would like to actively  partecipate to the project by giving some of your data, please contact us, we'll be glad to add your service to our project**.
Each visualized threat comes with the original and 'clickable' URL pointing to the original report. The original report owns all the specific information to the threat.

## Helping the Project !
It would be great having the opportunity to publish a live version of MalControl Center.

To accomplish this task we need one of the following:

1. Money Donation (GitTip, preferred channel [see badget Mania for our current income in GitTip]]) in order to buy domain and hosting 
2. Hosting Donation.

It would be great having the opportunity to spend more time in developing this project in order to build an amazing Open Source platform able to grab most of the freely available infos on Malware and Threats showing them to the entire world with no fee or charges.
To accomplish this task we need one of the following:

1. Little money donations (GitTip, preferred channel)
2. Helping us in developing MalControl. Please contact me !


## How to Install Malcontrol
In order to run MalControl on your own, you need to install:

* NodeJS: [nodejs web site](http://nodejs.org/)
* Mongo DB: [installing mongodb](http://docs.mongodb.org/manual/installation/)
* git: [installing GIT](http://git-scm.com/book/en/Getting-Started-Installing-Git)

Once you've installed the required software, it's time to clone that repository and to install dependencies:

1. `git clone git@github.com:marcoramilli/malcontrol.git`
2. `cd malcontrol.git`
3. `npm install`

You need to configure the conf/configs.json file at your will. For example you need to add your own mapbox key.
MapBox Key are free (under specific conditions) please take a look to https://www.mapbox.com


Now it's time to launch it !

1. `grunt`
2. `npm start` 
3.  go to [localhost:8080](http://localhost:8080)

## Backend Structure

A backround node scrapes websites to grab malware informations and fills up a mongod database. An API node serves API useful to frontend layer. Public API are available, please read doc/index.html for a full list of API. If you are interested on developing a website scraper take as example one of the scrapers available into the scrapers folder. Each scraper must be a function 'goScraper' ending-up saving scraped data to db using the functionsaveMalwareToDB respecting the db schema placed into schemas/ 

## Visualization

A world map displays, through the use of markers, the locations of all geolocalized malwares and threats detected by the scrapers. Every single marker has the shape of the logo of the scraped source of origin. Markers can be grouped, zoom map to see detailed information. Some useful charts are displayed on the right side showing all the information supplyed by backend's API.

## Screenshots
Screenshots talk laudly :) The following image shows how MalControl geolocalize malware and threts by grouping them by country. On the rigth side of the screen graphs with transparent gradient shows trends and totals of the analized sources. The top two charts show the "top countries" spreading malware/threats.

![Map 1](http://2.bp.blogspot.com/-G-AOWg_JYTs/U2NdF0UVGGI/AAAAAAAALsQ/WTgPVHdqekI/s1600/Screen+Shot+2014-05-02+at+10.49.21.png)

The second top two charts shows how many malware/threats per hour Malcontrol is able to capture. This feature gives an instant view on how the "malware world" is progressing. The last two charts show the totals of malware/threats coming from the scraped sources. If you are interested on adding a source (by writing a scraper) please make a pull request or contact us.
  
![Map 2](http://3.bp.blogspot.com/-s3An4fzk_dk/U2NdJYFQbuI/AAAAAAAALsY/GgiZ4FybDTA/s1600/Screen+Shot+2014-05-02+at+10.49.49.png)

By drilling down into a specific malware/threat you will see the icons of the scraped sources. By clicking on such icons a tooltip pops-up within detailed informations on the selected malware/threat. The imformations are source specific and might be different from source to source. The following image shows you detailed information on a PhishTank which provides Malicius URL and Report specific Report.

![Map 3](http://1.bp.blogspot.com/-iQEai9Q_iaI/U2NdDKsjp5I/AAAAAAAALsI/trctiyi3HVg/s1600/Screen+Shot+2014-04-29+at+17.14.19.png)  

The following video shows how malcontrol is supposed to work. Please note the frontend might change overtime and the video might be outdated

[![Simple Working Video](http://2.bp.blogspot.com/-rery0x-AyHs/U3ZRxBETLTI/AAAAAAAALt0/1Mdwjcvb7vI/s1600/Screen+Shot+2014-05-16+at+19.57.48.png)](http://screencast.com/t/GGMH8q77F9a)


## Open API 
Please refer to doc section for a fully documented Public API

## The project has been "acquired" by Yoroi srl
![YOROI](http://www.yoroi.company/images/logo.svg =100x100)
