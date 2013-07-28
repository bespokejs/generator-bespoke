# Bespoke.js Generator
[![Build Status](https://secure.travis-ci.org/markdalgleish/generator-bespoke.png?branch=master)](https://travis-ci.org/markdalgleish/generator-bespoke)

A generator for Yeoman. This is a work in progress.

## FAQ

### Q: I'm getting `EMFILE, too many open files`

EMFILE means you've reached the OS limit of concurrently open files. You can permanently increase it to 1200 by running the following command:

```bash
echo "ulimit -n 1200" >> ~/.bashrc
```

## License
[MIT License](http://markdalgleish.mit-license.org)
