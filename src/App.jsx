import { useState } from "react";
import tokenMappings from "./utility/tokenMappins.json";
import { bgColors } from "./utility/Constants";

function App() {
  const [encoded, setEncoded] = useState([]);
  const [inputText, setInputText] = useState("");

  // Sort token keys by longest first (to match multi-letter words like "hello")
  const sortedKeys = Object.keys(tokenMappings).sort(
    (a, b) => b.length - a.length
  );

  const encode = (text) => {
    const tokens = [];
    let i = 0;

    while (i < text.length) {
      let matched = false;

      for (const token of sortedKeys) {
        if (text.slice(i, i + token.length) === token) {
          tokens.push(tokenMappings[token]);
          i += token.length;
          matched = true;
          break;
        }
      }

      if (!matched) {
        const char = text[i];
        tokens.push(tokenMappings[char] ?? -1); // -1 = unknown
        i++;
      }
    }

    return tokens;
  };

  // Reverse mapping number => token string
  const reverseTokenMappings = Object.fromEntries(
    Object.entries(tokenMappings).map(([key, value]) => [value, key])
  );

  const decode = (encodedTokens) => {
    return encodedTokens
      .map((tokenValue) => reverseTokenMappings[tokenValue] ?? "?")
      .join("");
  };

  const handleEncodeClick = (e) => {
    setEncoded(encode(inputText));
  };

  function handleInputChange(e) {
    setInputText(e.target.value);
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 rounded-lg shadow-md max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Text Tokenizer Tool
      </h1>

      <div>
        <h2 className="text-lg font-semibold mb-2">Original Input</h2>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your original text here..."
          rows="4"
          cols="50"
          value={inputText}
          onChange={handleInputChange}
        ></textarea>
        <button
          onClick={handleEncodeClick}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Tokenize Text
        </button>
      </div>

      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-2">Tokenized Input</h2>
        <div
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 break-words font-mono min-h-[100px] whitespace-pre-wrap"
          placeholder="Encoded tokens will appear here..."
        >
          {encoded.map((tokenValue, id) => {
            const bgColor =
              bgColors[Math.floor(Math.random() * bgColors.length)];

            return (
              <span
                className="border-0 rounded px-1.5"
                style={{ backgroundColor: bgColor }}
              >
                {decode([tokenValue])}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-2">Decoded Mapings</h2>
        <textarea
          className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
          value={encoded}
        ></textarea>
      </div>
    </div>
  );
}

export default App;
