# HIT Scraper

## What is this?

For anyone who stumbles upon this and wonders what it is:

HIT Scraper is a tool for Amazon Mechanical Turk to make searching "HITs" easier and/or more efficient. Over the years HIT Scraper has had several different maintainers and this is yet another fork of the old tool.

## Abandoned

TurkOpticon (1 and 2), the for-a-while de facto MTurk Requester rating platform, is soon to be archived/shut down so a big part of this tool (in my opinion) will go with it. This helped me realize that putting in the time making/maintaining a useful tool for MTurk isn't rewarding for me since whatever I do will probably be obsolete/broken in 1-2 years when someone updates or shuts down something on a whim.

I'll leave this here in case someone finds it useful for some reason in the future.

## Building

- `npm install`
- `npm run build`
- The built script will be at `build/hit-scraper.user.js`

**Note about `pnpm`**: It looks like (without looking too much into it) that `rollup-plugin-typescript2` works in a way that is broken when using `pnpm`. So use `yarn` until that's maybe fixed some day.
