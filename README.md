# Dynamic Images Gallery
This Web part display images in specified library that order by 'Modified' field value.

![callendar](/dynamic-images-gallery/assets/demo.gif)

## Used SharePoint Framework Version 
![drop](https://img.shields.io/badge/version-1.9.1-green.svg)

## WebPart Properties
 
Property |Type|Required| comments
--------------------|----|--------|----------
Images Gallery | Doropdown| yes| 
Max Items | Slider | yes |  

## Solution
This Web Part Use
- Nodejs 10.16.0
- SharePoint Framework 1.9.1
- PnPjs 1.3.5
- React 16.8.8
- Office UI Fabric React 6.189.2
- react-images-lightbox 5.1.0 (https://www.npmjs.com/package/react-image-lightbox)

Solution|Author(s)
--------|---------
Dynamic Images Gallery|Hirofumi Ota

## Disclaimer
**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- in the command line run:
  - `npm install`
  - `gulp build`
  - `gulp bundle --ship`
  - `gulp package-solution --ship`
  - `Add to AppCatalog and deploy`