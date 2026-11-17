import ollama from "ollama";

// In extract.ts we ASKED the model nicely to return JSON.
// Usually it works, but sometimes it adds text like "Here is your JSON:" and JSON.parse fails.
//
// Ollama has a better way: the "format" option.
// We give it a JSON Schema and Ollama forces the output to match that shape.

// TypeScript type for the data we expect back.
type Movie = {
  title: string;
  year: number;
  genres: string[];
  rating: number;
};

// The same shape, written as a JSON Schema for Ollama.
const movieSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    year: { type: "number" },
    genres: { type: "array", items: { type: "string" } },
    rating: { type: "number" },
  },
  required: ["title", "year", "genres", "rating"],
};

const text = `
Last night I watched Inception (2010). It's a sci-fi action thriller
about dreams inside dreams. I'd give it 9 out of 10.
`;

const response = await ollama.chat({
  model: "qwen2.5:3b",
  messages: [{ role: "user", content: `Extract the movie details from this text:\n${text}` }],
  format: movieSchema,
  options: { temperature: 0 },
});

const movie: Movie = JSON.parse(response.message.content);

console.log(movie);
console.log(`\n${movie.title} (${movie.year}) - ${movie.genres.join(", ")} - ${movie.rating}/10`);
