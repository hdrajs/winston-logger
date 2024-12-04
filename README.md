# winton-logger

## SUMMARY

A simple logging library that combines the simple base on winston

## USAGE

A logger has 5 different levels of logging in a specific order:

    'ERROR', 'WARN', 'INFO', 'DEBUG', 'VERBOSE', 'SUCCESS'
    
Each of these log levels has its own method on the logging instance. You can set the maximum log level on a logger at runtime.

By default, a logger writes to STDOUT, but given a writeable file path, it will log directly to a file.

### Install

Using NPM:

```
npm install winston-logger
```

Using YARN:

```
yarn add winston-logger
```

### Logging

```js
import { Logger, LoggerOptions } from 'winston-logger';

const options :LoggerOptions ={
  file:true
}

const logger = new Logger("Instance name",options)

logger.error('hello world')
logger.warn('hello world')
logger.log('hello world')
logger.debug('hello world')
logger.verbose('hello world')
logger.success('hello world')
```

## COMMENTS/ISSUES

F-f-fork it, baby.

## LICENSE

MIT, see the source.
