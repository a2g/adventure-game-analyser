
big chain of submodules, so pull with this:
```python:
  git pull --recurse-submodules
```
To debug:
-----------
VSCode->Run->Start Debugging

To test:
-----------
npm run test
I must have copied the 'test' script from TravisCI tech page - because I don't understand it!

If I run 'npm run test', then we don't get success message.. but lack of errors indicates success.

I still need a command line to debug mocha tests
