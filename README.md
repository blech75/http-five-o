# http-five-o

Express-based static HTTP server with basic auth.

Mission: To Protect and Serve HTTP requests.

## Background

**http-five-o** exists because I could not locate a Node.js-based HTTP server that statisfied my two requirements: 1) served static files, and 2) protected them via [HTTP basic auth](https://en.wikipedia.org/wiki/Basic_access_authentication). I desired such a thing because I enjoy using [Heroku](https://www.heroku.com) and didn't want the overhead of Apache/Nginx.

I wanted to build off an exisitng solution and [Express](http://expressjs.com) seemed like a nice enough framework to start from. I liked the concept of middleware—the key component being [express.static](http://expressjs.com/guide/using-middleware.html#express.static))—which, with minimal effort, allowed me to tack on a basic auth solution I cobbled together based on a some [code sample](https://davidbeath.com/posts/expressjs-40-basicauth.html).

(As a fringe benefit, this whole process also allowed me to dig deeper into Node.js and npm, and not to mention publish my first npm package. Woohoo!)



## Getting Started
The **http-five-o** package consists of a single executable, `http5o`. It is intended as a command line (cli) utility and thus does not (currently) expose itself as a proper Node.js module.

**http-five-o** coexists comfortably as both a locally installed project dependency and a globally installed package. You probably want (and need) both options. The local dependency is used for serving your project when deployed; The global utility is for general cli use (serving arbitrary directories).

**Note:** Since **http-five-o** is intended for serving pages, it should be considered a dependency (installed via `--save`), not a dev dependency (installed via `--save-dev`.)  This distinction is important for deploying to, say, Heroku, because you want **http-five-o** installed there.

### Installing as a project dependency
 
 ```
 $ npm install --save http-five-o
 ```

### Installing as a global utility

```
$ npm install -g http-five-o
```

## Usage

### Global Usage

When installed as a global utility, you can call it from your shell like so:

```
$ http5o
```

By default it will serve the current directory. See [Configuration Options](#ConfigurationOptions) below for more details.

### Via npm scripts

If you did not install it as a global utility, but would like to use it to serve your project, you can utilize [npm scripts](https://docs.npmjs.com/misc/scripts) to launch `http5o` because [npm scripts can access the path to the locally installed executables](https://docs.npmjs.com/misc/scripts#path). To do this, add a `scripts` block to your `package.json`. Here's an example using `npm start`:

```
{
  // ...
  "scripts": {
    "start": "DISABLE_HTTP_AUTH=true http5o"
  },
  // ...
}
```

Notice the configuration set via environment variables. See [Configuration Options](#ConfigurationOptions) below for more details.


### Via npm scripts & `heroku local`

Modify your package.json similar to above, but instead of calling http5o directly, call [`heroku local`](https://devcenter.heroku.com/articles/heroku-local):

```
{
  // ...
  "scripts": {
    "start": "heroku local"
  },
  // ...
}
```

Then, create a [`.env`](https://devcenter.heroku.com/articles/heroku-local#add-a-config-var-to-your-env-file) file in your project to store any desired [configuration](#ConfigurationOptions):

```
DISABLE_HTTP_AUTH=true
DOCROOT=src
```

**WARNING:** Be sure to add .env to your .gitignore file.

**NOTE:** Going this route requires that you have `http5o` installed globally. This is because Heroku uses Foreman/Forego to run `http5o`, which is not aware of the local npm executable path.

**NOTE:** Going this route also means you delegate the port selection to Foreman/Forgo, which is usually port 5000 (unless you set it via `.env`).


### Deploying to Heroku

Create a [`Procfile`](https://devcenter.heroku.com/articles/procfile) in the root of your project containing the following:
```
web: http5o
```
Then [set the appropriate config variables for your Heroku app](https://devcenter.heroku.com/articles/config-vars).


## Configuration Options

`http5o` is controlled by environment variables in the shell that launches it.

* `HTTP_USERNAME` (default value: `http5o`)
* `HTTP_PASSWORD` (default value: `protectandserve`)
* `HTTP_REALM` (default value: `Authorization Required`)
* `DOCROOT` (default value: `.`)
* `INDEX_FILE` (default value: `index.html`)
* `PORT` (default value: `5000`)
* `DISABLE_HTTP_AUTH` (default value: empty/`false`)

The primary use case is being managed by `heroku local`, which uses a  `Procfile` and a

In order to do this, you need to install the module globally so it's available in your `$PATH`.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


## Release History

### v0.1.0

* First stable release
* Documentation


## License
Copyright (c) 2015 Justin Blecher  
Licensed under the MIT license.
