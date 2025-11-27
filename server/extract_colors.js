const getColors = require('get-image-colors');
const path = require('path');

const imagePath = process.argv[2];

getColors(imagePath).then(colors => {
  console.log("Extracted Colors:");
  colors.forEach(color => {
    console.log(color.hex());
  });
}).catch(err => {
  console.error(err);
});
