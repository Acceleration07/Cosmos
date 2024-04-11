
# Cosmos+

A Linux Debian/Ubuntu Distro Movie/TV-Show Watching Website

- [Features](#features)
- [Disclaimers](#disclaimers)
- [Installation](#installation)
- [Commands](#commands)
- [FAQ](#faq)



## Features

- Watching Movies or TV Shows
- Compatible With Laptop or Phone
- Continue Watching Feature
- Easy Movie Installation

## Disclaimers

- This is most ideal for servers or computers that are always on
- This is NOT persistant with network changes, so it will break if the network ip changes
- This will NOT run on any Windows
 
## Installation

Install Cosmos+ with bash
- First download the files from [Releases](https://github.com/chuck4565656/Cosmos/releases), and move the zip file to a folder that won't change (NOTE: *if the folder changes the website will break*)

A [OMDb API](https://www.omdbapi.com/apikey.aspx?__EVENTTARGET=freeAcct&__EVENTARGUMENT=&__LASTFOCUS=&__VIEWSTATE=%2FwEPDwUKLTIwNDY4MTIzNQ9kFgYCAQ9kFgICBw8WAh4HVmlzaWJsZWhkAgIPFgIfAGhkAgMPFgIfAGhkGAEFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYDBQtwYXRyZW9uQWNjdAUIZnJlZUFjY3QFCGZyZWVBY2N0oCxKYG7xaZwy2ktIrVmWGdWzxj%2FDhHQaAqqFYTiRTDE%3D&__VIEWSTATEGENERATOR=5E550F58&__EVENTVALIDATION=%2FwEdAAU%2BO86JjTqdg0yhuGR2tBukmSzhXfnlWWVdWIamVouVTzfZJuQDpLVS6HZFWq5fYpioiDjxFjSdCQfbG0SWduXFd8BcWGH1ot0k0SO7CfuulHLL4j%2B3qCcW3ReXhfb4KKsSs3zlQ%2B48KY6Qzm7wzZbR&at=freeAcct&Email=) Key Is Reqiured to download Movies and TV-Shows to Cosmos+ 


Navigate to where you want the project folder to be
```bash
  cd {project-folder}
```

Clone The Repository
```bash
  git clone https://github.com/Acceleration07/Cosmos.git
```

Navigate to your Project folder
```bash
  cd Cosmos
```

Install Cosmos+ Using The Install Script
```bash
  sudo bash install.sh
```
Apache2 and FFmpeg will be installed using the install.sh

## Commands

Installing Cosmos+ will also come with some commands that give you the ability to add Movies and TV-Shows to Cosmos+


Downloading Movies Command (It will ask for IMDb Link, and M3U8 Link)

```bash
  movie-download
```

Downloading TV-Shows Command (It will ask for IMDb Link)

```bash
  tv-download
```

Download the Video Files for the TV-Shows

```bash
  tv-download-web
```
*inside the txt file you will put the m3u8 link for each episode*

## FAQ

*How do I Get M3U8 Links?*

You can use tools like [cococut](https://cococut.net/) to get M3U8 Links.

*Why do the Websites I get my M3U8 links from have ads?*

The Ads on other websites aren't controlled by us, we recommend getting these Extensions to minimize the amount of ads you see:
- [uBlock Origin](https://chromewebstore.google.com/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm)
- [Privacy Badger](https://chromewebstore.google.com/detail/privacy-badger/pkehgijcmpdhfbdbbnkijodmdjhbjlgp)
- [I don't Care About Cookies](https://chromewebstore.google.com/detail/i-dont-care-about-cookies/fihnjjcciajhdojfnbdddfaoknhalnja)

## Authors

- [@Acceleration07](https://www.github.com/Acceleration07)

