import { askAI } from "./chat.ts";

async function extractCountryInfo(country: string) {
  const question = `
    Extract country information.

    Return ONLY valid JSON.

    Use exactly this structure:

    {
        "country":"",
        "capital":"",
        "population":0,
        "currency":""
    }

    Country:

    ${country}
    `;

  const response = await askAI(question);

  try {
    const data = JSON.parse(response);

    console.log("Country:", data.country);
    console.log("Capital:", data.capital);
    console.log("Population:", data.population);
    console.log("Currency:", data.currency);
  } catch (error) {
    console.log("AI returned invalid JSON");
    console.log(response);
  }
}

async function extractPerson(text: string) {
  const question = `
    Extract person information.

    Return ONLY valid JSON.

    Structure:

    {
    "name":"",
    "experience":0,
    "skills":[]
    }

    Text:
    ${text}
    `;

  const response = await askAI(question);

  try {
    const data = JSON.parse(response);
    console.log(data);
  } catch (error) {
    console.log("Invalid JSON");
    console.log(response);
  }
}

async function extractProduct(text: string) {
  const question = `
    Extract product information.

    Return ONLY JSON.

    Structure:

    {
    "name":"",
    "price":0,
    "color":"",
    "stock":0
    }

    Product:
    ${text}
    `;

  const response = await askAI(question);

  try {
    const data = JSON.parse(response);
    console.log(data);
  } catch (error) {
    console.log("Invalid JSON");
    console.log(response);
  }
}

console.log("--- Country ---");
await extractCountryInfo("Pakistan");

console.log("\n--- Person ---");
await extractPerson(`
Ammar Shahid is a React developer.
He has 2 years of experience.
He knows JavaScript, React, Next and TypeScript.
`);

console.log("\n--- Product ---");
await extractProduct(`
MacBook Pro
Price: $1999
Color: Silver
Stock:12
`);
