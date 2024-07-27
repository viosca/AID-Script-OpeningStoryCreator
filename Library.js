
// Checkout the Guidebook examples to get an idea of other ways you can use scripting
// https://help.aidungeon.com/scripting

// Any functions or variables you define here will be available in your other modifier scripts.

// const secretNameOfTheKing = 'Bob'

// function getKingName() {
//   return secretNameOfTheKing
// }
let counter = 0;

class JSONParseError extends Error {}

function extractText(text, startMarker, endMarker) {
  const startIndex = text.indexOf(startMarker) + startMarker.length;
  const endIndex = text.indexOf(endMarker);

  //console.log(`extractText: ${startMarker}:${startIndex} to ${endIndex}:${endMarker}`);

  if (startIndex === -1 || endIndex === -1) {
    //console.log("extractText Returning null");
    return null;  // Marker text not found.
  }
  const extracted_text = text.substring(startIndex, endIndex)
  //console.log(`extractText Returning ${extracted_text}`);

  return extracted_text;
}

function removeText(text, startMarker, endMarker) {
  const start = text.indexOf(startMarker);
  const end = text.indexOf(endMarker);

  if (start === -1 || end === -1) {
    return text; // No JSON markers found
  }

  const beforeText = text.slice(0, start);
  const afterText = text.slice(end + endMarker.length);
  return beforeText + afterText;
}

/*
  Extracts the JSON data from a string with markers.
  Args: text: The string containing the JSON data with markers.
  Returns: The extracted JSON data as a dictionary, or null if not found.
*/
function extractJSON(text) {

  const jsonString = extractText(text, "JSON_BEGIN", "JSON_END");
  //console.log("extractJSON: ", jsonString);

  if (jsonString === null) {
    return null;  // JSON not found
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    if (error instanceof SyntaxError) { 
        throw new JSONParseError("Invalid JSON data", error);
    } else {
        throw error;  // Re-throw other types of errors
    }
  }
}

/*
  Removes the JSON data from a string with markers.
  Args: text: The string containing the JSON data with markers.
  Returns: The string with the JSON data removed.
*/
function removeJSON(text) {
  return removeText(text,"JSON_BEGIN", "JSON_END");
}

/*
  Extracts the Story Card Template.
  Args: text: The string containing the Story Card Template.
  Returns: The extracted Story Card Template.
*/
function extractSCTemplate(text) {
  return extractText(text, "SC_TEMPLATE_BEGIN", "SC_TEMPLATE_END");
}
/*
  Removes the Story Card Template from a string with markers.
  Args: text: The string containing the Story Card Template data with markers.
  Returns: The string with the Story Card Template data removed.
*/
function removeSCTemplate(text) {
  return removeText(text,"SC_TEMPLATE_BEGIN", "SC_TEMPLATE_END");
}

function loadDefaults(...infoObjects) { 
  infoObjects.forEach(infoObject => {
    for (const [key, value] of Object.entries(infoObject)) {
      if (typeof value === 'object' && value.hasOwnProperty('value') && value.hasOwnProperty('dflt')) { 
        // Object with 'value' and 'dflt' keys
        if (value.value === "") {
          value.value = value.dflt;
        }
      } else if (typeof value === 'object') { 
        loadDefaults(value); // Continue recursion for other cases 
      } 
    }
  });
}

function fillTemplate(template, data) {
  const regex = /{([a-zA-Z._0-9]+)}/g;

  return template.replace(regex, (match, keyPath) => {
    const keys = keyPath.split('.');
    let value = data;

    // Multiple Characters Scenario
    if (keys.length === 2) { 
      const characterKey = keys[0];
      const propertyKey = keys[1];
      value = data[characterKey] && data[characterKey][propertyKey] && data[characterKey][propertyKey].value ? data[characterKey][propertyKey].value : "";

    } else { 
      // Single Character Scenario
      const propertyKey = keys[0];
      value = data[propertyKey] ? data[propertyKey] && data[propertyKey].value : "";
    }
    if (/^\s*$/.test(value)) {
      value = `missing property(${keyPath})`;
    }
    return value;
  });
}

function generateStoryCard(infoObject) {
  let cardData = fillTemplate(storyCardTemplate, infoObject); 
  infoObject.storyCard = cardData; 
}
