
// Checkout the Guidebook examples to get an idea of other ways you can use scripting
// https://help.aidungeon.com/scripting
// Every script needs a modifier function
const modifier = (text) => {
    //console.log("info: ", info);
    //console.log("history: ", history);
    //console.log("storyCards: ", storyCards);
    //console.log("text: ", text);
    //console.log('globalThis: ', Object.getOwnPropertyNames(globalThis));
  
    //state.message = `INPUT state.message. ActionCount ${info.actionCount} Counter:${counter++}\n`;
  
    if (info.actionCount === 0) {
      //once = true;
  
      // openingStory = history[0].text;
      let openingStory = text;
  
      //characterData = extractJSON(state.memory.context);
      characterData = extractJSON(openingStory);
      //console.log("Character data from JSON:", characterData);
      if (characterData !== null) {
        openingStory = removeJSON(openingStory);
        text = openingStory;
        // history[0] = { ...history[0], text: openingStory};
        // console.log("history: ", history);
        //localMemory = removeJSON(state.memory.context)
  
        loadDefaults(characterData);
        //console.log("Character data after loadDefaults:", characterData);
  
        // Story Cards
        storyCardTemplate = extractSCTemplate(openingStory);
        //storyCardTemplate = extractSCTemplate(localMemory);
        console.log("storyCardTemplate: ", storyCardTemplate);
  
        if (storyCardTemplate !== null) { 
          openingStory = removeSCTemplate(openingStory);
          text = openingStory;
  
          let triggerTemplate = "{name},{species} {gender},{species}{gender},{species} Pers,{species} Peop";
  
          let characterCard = fillTemplate(storyCardTemplate, characterData.character);
          characterCard = characterCard.trim();
          let characterTriggers = fillTemplate(triggerTemplate, characterData.character);
          addStoryCard(characterTriggers, characterCard, "Character");
  
          let partnerCard = fillTemplate(storyCardTemplate, characterData.partner);
          partnerCard = partnerCard.trim();
          let partnerTriggers = fillTemplate(triggerTemplate, characterData.partner);
          addStoryCard(partnerTriggers, partnerCard, "Character");
  
          openingStory = fillTemplate(openingStory, characterData);
          openingStory = openingStory.trim();
  
          //history[0].text = openingStory;
          text = openingStory;
  
          //console.log("characterCard: ", characterCard);
          //console.log("partnerCard: ", partnerCard);
        }
      }
    }
      
    return { text }
  }
  
  // Don't modify this part
  modifier(text)