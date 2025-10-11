const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/';
const filenames = ['American.png', 'Asian.png', 'BBQ.png', 'Bakery.png', 'Breakfast.png', 'BubbleTea.png', 'Burgers.png', 'Caribbean.png', 'Chicken.png', 'Chinese.png', 'Coffee.png', 'Dessert.png', 'FastFood.png', 'Greek.png', 'Hawaiian.png', 'Healthy.png', 'IceCream.png', 'Indian.png', 'Japanese.png', 'Korean.png', 'Kosher.png', 'Pizza.png', 'Salad.png', 'Sandwich.png', 'Seafood.png'];

const outputDir = path.join(__dirname, 'cuisine-images');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

filenames.forEach((filename) => {
  const fileUrl = baseUrl + filename;
  const dest = path.join(outputDir, filename);

  https
    .get(fileUrl, (res) => {
      if (res.statusCode !== 200) {
        console.error(`❌ ${filename} — Status: ${res.statusCode}`);
        return;
      }

      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✅ Downloaded: ${filename}`);
      });
    })
    .on('error', (err) => {
      console.error(`⚠️ Error downloading ${filename}: ${err.message}`);
    });
});

