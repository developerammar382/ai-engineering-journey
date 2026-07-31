import { askAI } from "./chat.js";

async function extractCountryInfo(country) {
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
    // console.log('Ai response:', response);
    const data = JSON.parse(response);
    // console.log("Extracted data:", data);
    console.log("Country:", data.country);

    console.log("Capital:", data.capital);

    console.log("Population:", data.population);

    console.log("Currency:", data.currency);
  } catch (error) {
    console.log("AI returned invalid JSON");

    console.log(response);
  }
}

// extractCountryInfo("Pakistan");

async function extractPerson(text) {
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
  }
}

// extractPerson(`
// Ammar Shahid is a React developer.
// He has 2 years of experience.
// He knows JavaScript, React, Next and TypeScript.
// `);

async function extractProduct(text) {
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
  }
}

extractProduct(`

MacBook Pro

Price: $1999

Color: Silver

Stock:12

`);
