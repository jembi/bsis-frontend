# BSIS Frontend

This application provides the new client-side code and frontend to the [Blood Safety Information System (BSIS)](http://www.github.com/jembi/bsis).

It is being developed with the following technology stack:
* Single page web application
* Responsive web design
* [AngularJS](www.angularjs.org)
* [Twitter Bootstrap](http://getbootstrap.com/)
* The [Yeoman](http://yeoman.io/) development workflow:
  * [Bower](http://bower.io/) for simple installation of JS libraries
  * [Grunt](http://gruntjs.com/) for build, optimization and live reload
  * [PhantomJS](http://phantomjs.org/) and [Karma](http://karma-runner.github.io/) for front-end testing

## Dependencies

The application makes use of node.js tools - [node.js](http://nodejs.org/) and it's package manager [(npm)](https://www.npmjs.org/) should be installed.

## Developer Guide

Clone the repository and run `npm install`. <br/>
It is then recommended to run `npm update`, especially if there are `npm WARN unmet dependency` warnings when running `npm install`. <br/>
To start up a development instance of the webapp, run `grunt serve` (or `npm start`).

The code was scaffolded using [angular-seed](https://github.com/angular/angular-seed), as well as [generator angular](https://github.com/yeoman/generator-angular) to add grunt support.

## Production Guide

To make use of the application in production, run `grunt build`, which compiles the code into the `dist` folder. The contents of this folder can be copied to the default root folder (e.g. `/var/www/html`) of a web server, such as Apache, and run in production. 

## Known Issues

On initial clone of the repo, when running `npm install` and using OS X, the following error may appear:
```
...
NodeJS error “EMFILE, too many open files”
...
```
This is caused by the code opening too many files at once. By default, OS X has a limit of 256 simultaneously opened files.
To resolve this, run the following command in a terminal to increase the file limit:
```
$ ulimit -n 1024
```

## Directory Layout

    app/                --> main application files
      css/              --> css files
      fonts/            --> fonts and glyphs
      images/           --> image files
      index.html        --> app layout file (the main html template file of the app)
      scripts/          --> javascript files
        app.js          --> application config and routing
        controllers/    --> application controllers
        services/       --> custom angular services 
        util/           --> custom angular util
      views/            --> angular views (partial html templates)
    infrastructure/     --> Puppet development and deployment scripts
    test/               --> test config and source files
    bower.json          --> Bower metadata and dependencies file
    Gruntfile.js        --> Grunt file used to configure tasks and build info
    package.json        --> npm metatada and dependencies file
    README.md           --> github repository readme file


