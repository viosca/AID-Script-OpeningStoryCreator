This is a simple opening story creator script for AI Dungeon.

Overview
You opening story as created in the scenario editor contains:
1. a JSON template that is filled out with AID's placeholder variables.
2. a story card template for creating story cards.

The script runs only when info.actionCount === 0. So that means when the opening story is passed to the inputModifier.
The JSON code, which has been prefilled with the placeholders, is used to edit the remaining opening story after the JSON is removed.
And something for story cards.
