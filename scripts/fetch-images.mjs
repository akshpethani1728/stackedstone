import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEST_DIR = join(__dirname, "..", "public", "destinations");

// Each destination: slug, and 3 search queries for Unsplash
const DESTINATIONS = [
  // --- INDIA (30) ---
  { slug: "goa", queries: ["Goa beach palm trees sunset", "Goa coastline aerial view", "Goa portuguese church architecture"] },
  { slug: "kashmir", queries: ["Kashmir Dal Lake houseboat", "Kashmir valley mountains snow", "Kashmir saffron fields chinar"] },
  { slug: "rajasthan", queries: ["Rajasthan desert fort sunset", "Rajasthan haveli architecture", "Rajasthan pink city jaipur"] },
  { slug: "kerala", queries: ["Kerala backwaters houseboat", "Kerala tea plantation hills", "Kerala coconut palm beach"] },
  { slug: "ladakh", queries: ["Ladakh mountains monastery", "Ladakh landscape desert mountains", "Ladakh pangong lake blue"] },
  { slug: "himachal", queries: ["Himachal Pradesh mountain valley", "Himachal pine forest hills", "Himachal wooden house architecture"] },
  { slug: "uttarakhand", queries: ["Uttarakhand himalayas mountains", "Uttarakhand river landscape", "Uttarakhand valley flowers"] },
  { slug: "sikkim", queries: ["Sikkim mountains monasteries", "Sikkim rhododendron forest", "Sikkim kanchenjunga view"] },
  { slug: "darjeeling", queries: ["Darjeeling tea gardens hills", "Darjeeling mountain sunrise", "Darjeeling toy train track"] },
  { slug: "meghalaya", queries: ["Meghalaya living root bridge", "Meghalaya waterfalls forest", "Meghalaya misty hills"] },
  { slug: "assam", queries: ["Assam tea plantation river", "Assam wildlife national park", "Assam brahmaputra river sunset"] },
  { slug: "andaman", queries: ["Andaman islands beach sunset", "Andaman coral reef snorkeling", "Andaman tropical island palm"] },
  { slug: "mumbai", queries: ["Mumbai skyline coastal road", "Mumbai marine drive sunset", "Mumbai colonial architecture"] },
  { slug: "delhi", queries: ["Delhi india gate monument", "Delhi qutub minar architecture", "Delhi humayun tomb heritage"] },
  { slug: "agra", queries: ["Agra taj mahal sunrise", "Agra taj mahal reflection pool", "Agra red fort architecture"] },
  { slug: "varanasi", queries: ["Varanasi ganges ghats sunrise", "Varanasi evening aarti ceremony", "Varanasi narrow streets temple"] },
  { slug: "udaipur", queries: ["Udaipur lake palace sunset", "Udaipur city palace architecture", "Udaipur boat lake view"] },
  { slug: "jaisalmer", queries: ["Jaisalmer desert sunset dunes", "Jaisalmer fort golden sandstone", "Jaisalmer desert camp stars"] },
  { slug: "jodhpur", queries: ["Jodhpur blue city houses", "Jodhpur meherangarh fort", "Jodhpur stepwell architecture"] },
  { slug: "rishikesh", queries: ["Rishikesh ganges river rafting", "Rishikesh suspension bridge", "Rishikesh yoga meditation"] },
  { slug: "manali", queries: ["Manali snow mountains", "Manali pine forest valley", "Manali himalayan landscape"] },
  { slug: "pondicherry", queries: ["Pondicherry french quarter streets", "Pondicherry promenade beach", "Pondicherry colonial architecture"] },
  { slug: "coorg", queries: ["Coorg coffee plantation hills", "Coorg misty mountains estate", "Coorg waterfalls forest"] },
  { slug: "ooty", queries: ["Ooty tea gardens mist", "Ooty botanical garden lake", "Ooty mountain railway view"] },
  { slug: "hampi", queries: ["Hampi boulder landscape ruins", "Hampi virupaksha temple", "Hampi sunset hill view"] },
  { slug: "chennai", queries: ["Chennai marina beach sunrise", "Chennai kapaleeshwarar temple", "Chennai colonial architecture"] },
  { slug: "kolkata", queries: ["Kolkata victoria memorial", "Kolkata howrah bridge river", "Kolkata colonial street architecture"] },
  { slug: "hyderabad", queries: ["Hyderabad charminar night", "Hyderabad golconda fort", "Hyderabad hussain sagar lake"] },
  { slug: "gokarna", queries: ["Gokarna beach palm trees", "Gokarna temple coastal town", "Gokarna om beach shore"] },
  { slug: "spiti", queries: ["Spiti valley desert mountains", "Spiti monastery landscape", "Spiti himachal moonlandscape"] },

  // --- ASIA (20) ---
  { slug: "japan", queries: ["Japan kyoto temple garden", "Japan mount fuji spring", "Japan tokyo street night"] },
  { slug: "bali", queries: ["Bali rice terraces ubud", "Bali beach temple sunset", "Bali tropical jungle waterfall"] },
  { slug: "thailand", queries: ["Thailand phi phi island beach", "Thailand bangkok temples", "Thailand chiang mai mountains"] },
  { slug: "vietnam", queries: ["Vietnam ha long bay rocks", "Vietnam rice terraces fields", "Vietnam hoi an lantern street"] },
  { slug: "cambodia", queries: ["Cambodia angkor wat temple sunrise", "Cambodia siem reap ruins", "Cambodia floating village"] },
  { slug: "sri-lanka", queries: ["Sri lanka tea plantation hills", "Sri lanka beach palm sunset", "Sri lanka sigiriya rock fort"] },
  { slug: "maldives", queries: ["Maldives overwater bungalow", "Maldives beach turquoise water", "Maldives sunset ocean"] },
  { slug: "nepal", queries: ["Nepal himalayas mountain view", "Nepal kathmandu temple stupa", "Nepal pokhara lake mountains"] },
  { slug: "bhutan", queries: ["Bhutan tiger nest monastery", "Bhutan valley landscape", "Bhutan dzong architecture"] },
  { slug: "myanmar", queries: ["Myanmar bagan temple sunrise", "Myanmar inle lake fishermen", "Myanmar yangon shwedagon pagoda"] },
  { slug: "philippines", queries: ["Philippines palawan island beach", "Philippines rice terraces banaue", "Philippines coral reef snorkeling"] },
  { slug: "malaysia", queries: ["Malaysia petronas towers city", "Malaysia borneo rainforest", "Malaysia langkawi beach"] },
  { slug: "singapore", queries: ["Singapore gardens by the bay", "Singapore skyline marina bay", "Singapore chinatown heritage"] },
  { slug: "south-korea", queries: ["South korea seoul夜景", "South korea jeju island coast", "South korea traditional hanok village"] },
  { slug: "china", queries: ["China great wall mountains", "China guilin rice terraces", "China forbidden city beijing"] },
  { slug: "taiwan", queries: ["Taiwan taipei 101 skyline", "Taiwan taroko gorge marble", "Taiwan jiufen mountain town"] },
  { slug: "laos", queries: ["Laos luang prabang temple", "Laos mekong river sunset", "Laos kuang si waterfall"] },
  { slug: "uzbekistan", queries: ["Uzbekistan samarkand registan", "Uzbekistan bukhara architecture", "Uzbekistan khiva desert"] },
  { slug: "mongolia", queries: ["Mongolia gobi desert landscape", "Mongolia steppe horses", "Mongolia ger camp sunset"] },
  { slug: "oman", queries: ["Oman desert dunes sunset", "Oman wadi waterfall canyon", "Oman muscat coastline"] },

  // --- EUROPE (20) ---
  { slug: "iceland", queries: ["Iceland northern lights aurora", "Iceland waterfall mountain", "Iceland black sand beach"] },
  { slug: "switzerland", queries: ["Swiss alps lake village", "Switzerland mountain valley summer", "Switzerland lucerne lake bridge"] },
  { slug: "italy", queries: ["Italy amalfi coast village", "Italy tuscany hills cypress", "Italy venice canals gondola"] },
  { slug: "france", queries: ["France lavender fields provence", "France paris eiffel tower", "France french riviera coast"] },
  { slug: "greece", queries: ["Greece santorini white houses sunset", "Greece mykonos windmills", "Greece athens acropolis"] },
  { slug: "portugal", queries: ["Portugal lisbon tile street", "Portugal algarve coast cliffs", "Portugal porto river bridge"] },
  { slug: "spain", queries: ["Spain alhambra granada palace", "Spain barcelona park guell", "Spain andalusia white village"] },
  { slug: "scotland", queries: ["Scotland highlands lake loch", "Scotland edinburgh castle", "Scotland isle skye landscape"] },
  { slug: "norway", queries: ["Norway fjord landscape", "Norway lofoten islands fishing", "Norway northern lights fjord"] },
  { slug: "croatia", queries: ["Croatia dubrovnik coast", "Croatia plitvice lakes falls", "Croatia hvar island beach"] },
  { slug: "turkey", queries: ["Turkey cappadocia balloons sunrise", "Turkey istanbul hagia sophia", "Turkey pamukkale terraces"] },
  { slug: "czech-republic", queries: ["Czech prague charles bridge", "Czech cesky krumlov town", "Czech prague castle street"] },
  { slug: "netherlands", queries: ["Netherlands tulip fields spring", "Netherlands amsterdam canals", "Netherlands windmill landscape"] },
  { slug: "austria", queries: ["Austria hallstatt lake village", "Austria alps mountain hut", "Austria vienna palace"] },
  { slug: "ireland", queries: ["Ireland cliffs moher coast", "Ireland ring kerry landscape", "Ireland dublin temple bar"] },
  { slug: "denmark", queries: ["Denmark copenhagen nyhavn", "Denmark møns klint cliffs", "Denmark frederiksborg palace"] },
  { slug: "sweden", queries: ["Sweden stockholm archipelago", "Sweden lapland northern lights", "Sweden gothenburg canals"] },
  { slug: "hungary", queries: ["Hungary budapest parliament night", "Hungary fisherman bastion", "Hungary thermal bath"] },
  { slug: "poland", queries: ["Poland zakopane mountains", "Poland krakow market square", "Poland malbork castle"] },
  { slug: "georgia", queries: ["Georgia caucasus mountains", "Georgia tbilisi old town", "Georgia svaneti tower village"] },

  // --- AMERICAS (15) ---
  { slug: "new-york", queries: ["New york skyline manhattan sunset", "New york central park autumn", "New york brooklyn bridge"] },
  { slug: "california", queries: ["California highway big sur coast", "California yosemite valley", "California golden gate bridge"] },
  { slug: "grand-canyon", queries: ["Grand canyon national park sunset", "Grand canyon aerial view", "Grand canyon colorado river"] },
  { slug: "canada", queries: ["Canada banff lake louise", "Canada rocky mountains", "Canada toronto skyline"] },
  { slug: "mexico", queries: ["Mexico tulum beach ruins", "Mexico guanajuato colorful street", "Mexico yucatan cenote"] },
  { slug: "peru", queries: ["Peru machu picchu sunrise", "Peru rainbow mountain", "Peru sacred valley terraces"] },
  { slug: "brazil", queries: ["Brazil rio christ redeemer", "Brazil amazon rainforest river", "Brazil lencois maranhenses dunes"] },
  { slug: "colombia", queries: ["Colombia cartagena colonial street", "Colombia cocora valley palm", "Colombia medellin city"] },
  { slug: "costa-rica", queries: ["Costa rica rainforest waterfall", "Costa rica beach sunset", "Costa rica volcano arenal"] },
  { slug: "argentina", queries: ["Argentina patagonia mountains", "Argentina buenos aires colorful", "Argentina iguazu falls"] },
  { slug: "chile", queries: ["Chile atacama desert landscape", "Chile torres del paine", "Chile easter island statues"] },
  { slug: "cuba", queries: ["Cuba havana colorful street", "Cuba vintage car malecon", "Cuba viñales valley tobacco"] },
  { slug: "hawaii", queries: ["Hawaii na pali coast", "Hawaii volcanic national park", "Hawaii waikiki beach sunset"] },
  { slug: "patagonia", queries: ["Patagonia glacial ice field", "Patagonia mountain reflection", "Patagonia steppe landscape"] },
  { slug: "antelope-canyon", queries: ["Antelope canyon slot canyon", "Antelope canyon orange rock", "Arizona desert monument valley"] },

  // --- AFRICA (10) ---
  { slug: "morocco", queries: ["Morocco chefchaouen blue street", "Morocco sahara desert dunes", "Morocco marrakech medina"] },
  { slug: "south-africa", queries: ["South africa cape town table mountain", "South africa kruger safari wildlife", "South africa garden route coast"] },
  { slug: "kenya", queries: ["Kenya maasai mara safari", "Kenya mount kenya landscape", "Kenya diani beach ocean"] },
  { slug: "tanzania", queries: ["Tanzania serengeti sunset", "Tanzania zanzibar beach", "Tanzania kilimanjaro mountain"] },
  { slug: "egypt", queries: ["Egypt pyramids giza sunset", "Egypt luxor temple karnak", "Egypt nile river felucca"] },
  { slug: "namibia", queries: ["Namibia sand dunes dead valley", "Namibia sossusvlei red dunes", "Namibia skeleton coast"] },
  { slug: "madagascar", queries: ["Madagascar baobab avenue", "Madagascar tsingy limestone", "Madagascar rainforest lemur"] },
  { slug: "ethiopia", queries: ["Ethiopia lalibela rock church", "Ethiopia danakil desert", "Ethiopia simien mountains"] },
  { slug: "seychelles", queries: ["Seychelles anse source d'argent", "Seychelles granite boulders beach", "Seychelles tropical island"] },
  { slug: "mauritius", queries: ["Mauritius le morne mountain", "Mauritius underwater waterfall", "Mauritius chamarel colored earth"] },

  // --- OCEANIA (8) ---
  { slug: "sydney", queries: ["Sydney opera house harbour", "Sydney bondi beach coast", "Sydney blue mountains view"] },
  { slug: "new-zealand", queries: ["New zealand milford sound fjord", "New zealand mount cook lake", "New zealand hobbiton shire"] },
  { slug: "queensland", queries: ["Queensland great barrier reef", "Queensland whitsunday beach", "Queensland daintree rainforest"] },
  { slug: "tasmania", queries: ["Tasmania wineglass bay coast", "Tasmania overland track mountain", "Tasmania crayfish river"] },
  { slug: "fiji", queries: ["Fiji tropical beach island", "Fiji coral reef snorkeling", "Fiji waterfall jungle"] },
  { slug: "french-polynesia", queries: ["French polynesia overwater bungalow", "French polynesia turquoise lagoon", "French polynesia island aerial"] },
  { slug: "papua", queries: ["Papua raja ampat islands", "Papua coral reef aerial", "Papua highlands tribe village"] },
  { slug: "cook-islands", queries: ["Cook islands aitutaki beach", "Cook islands lagoon turquoise", "Cook islands rarotonga mountain"] },
];

async function fetchImage(url) {
  const resp = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const buffer = Buffer.from(await resp.arrayBuffer());
  return buffer;
}

async function searchUnsplashImage(query) {
  try {
    const searchUrl = `https://unsplash.com/s/photos/${encodeURIComponent(query)}`;
    const resp = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
    });
    const html = await resp.text();

    // Extract image URLs from the page - Unsplash embeds them in JSON-LD and meta tags
    const photoRegex = /https:\/\/images\.unsplash\.com\/photo-([a-zA-Z0-9_-]+)/g;
    const matches = [...new Set([...html.matchAll(photoRegex)].map(m => m[0]))];

    // Filter for reasonable size images and return the first one
    for (const baseUrl of matches) {
      if (baseUrl.includes("placeholder")) continue;
      return `${baseUrl}?w=1600&q=85&fm=jpg&fit=crop`;
    }
    return null;
  } catch (e) {
    console.error(`  Search failed: ${e.message}`);
    return null;
  }
}

async function downloadImage(url, filepath) {
  try {
    const buffer = await fetchImage(url);
    await writeFile(filepath, buffer);
    return true;
  } catch (e) {
    console.error(`  Download failed: ${e.message}`);
    return false;
  }
}

async function processDestination(dest) {
  const dir = join(DEST_DIR, dest.slug);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  const files = ["hero.webp", "gallery-1.webp", "gallery-2.webp"];
  let successCount = 0;

  for (let i = 0; i < dest.queries.length; i++) {
    const query = dest.queries[i];
    const filepath = join(dir, files[i]);

    if (existsSync(filepath)) {
      console.log(`  ${files[i]} exists, skipping`);
      successCount++;
      continue;
    }

    console.log(`  Searching: "${query}"`);
    const imageUrl = await searchUnsplashImage(query);

    if (imageUrl) {
      console.log(`  Downloading: ${imageUrl.substring(0, 80)}...`);
      const ok = await downloadImage(imageUrl, filepath);
      if (ok) {
        console.log(`  Saved: ${files[i]}`);
        successCount++;
        // Wait briefly between requests
        await new Promise(r => setTimeout(r, 1500));
      }
    } else {
      console.log(`  No image found`);
    }
  }

  return successCount;
}

async function main() {
  console.log(`Fetching images for ${DESTINATIONS.length} destinations...\n`);

  let totalSuccess = 0;
  let totalFail = 0;

  for (const dest of DESTINATIONS) {
    console.log(`\n[${dest.slug}]`);
    const count = await processDestination(dest);
    totalSuccess += count;
    totalFail += dest.queries.length - count;
    console.log(`  → ${count}/${dest.queries.length} images`);
    // Delay between destinations
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\n=== Done ===`);
  console.log(`Total: ${totalSuccess} success, ${totalFail} failed out of ${DESTINATIONS.length * 3}`);
}

main().catch(console.error);
