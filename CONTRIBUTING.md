# Contributing Guide

Contributing to `angular-cache` is fairly easy. This document shows you how to
get the project, run all provided tests and generate a production ready build.

It also covers provided grunt tasks, that help you developing on `angular-cache`.

## Dependencies

To make sure, that the following instructions work, please install the following dependecies
on you machine:

- Node.js
- npm
- Git

If you install node through the binary installation file, **npm** will be already there.
When **npm** is installed, use it to install the needed npm packages:

- bower `npm install -g bower`
- grunt-cli `npm install -g grunt-cli`
- karma `npm install -g karma`

## Installation

To get the source of `angular-cache` clone the git repository via:

````
$ git clone https://github.com/jmdobry/angular-cache
````

This will clone the complete source to your local machine. Navigate to the project folder
and install all needed dependencies via **npm** and **bower**:

````
$ npm install
$ bower install
````

`angular-cache` is now installed and ready to be built.

## Building

`angular-cache` comes with a few **grunt tasks** which help you to automate
the development process. The following grunt tasks are provided:

#### `grunt`

Running `grunt` without any parameters, will actually execute the registered
default task. This task is currently nothing more then a **lint task**, to make sure
that your JavaScript code is written well.

#### `grunt test`

`grunt test` executes the unit tests, which are located in `test/`. The task uses **karma** the spectacular test runner to execute the tests with the **jasmine testing framework**.

#### `grunt build`

You only have to use this task, if you want to generate a production ready build of
`angular-cache`. This task will also **lint**, **test** and **minify** the
source. After running this task, you'll find the following files in a generated
`dist` folder:

````
dist/angular-cache-x.x.x.js
dist/angular-cache-x.x.x.min.js
````

## Contributing/Submitting changes

- Checkout a new branch based on `master` and name it to what you intend to do:
  - Example:
    ````
    $ git checkout -b BRANCH_NAME
    ````
  - Use one branch per fix/feature
- Make your changes
  - Make sure to provide a spec for unit tests
  - Run your tests with either `karma start` or `grunt test`
  - When all tests pass, everything's fine
- Commit your changes
  - Please provide a git message which explains what you've done
  - Commit to the forked repository
- Make a pull request
  - Travis CI is watching you!
