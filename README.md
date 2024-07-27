A simple opening story creator script for AI Dungeon.

### Overview
Your opening story as created in the scenario editor contains:
1. A JSON template that is filled out with AID's placeholder variables.
2. A Story card template for creating story cards.
3. Your opening story.

The script runs only when ```info.actionCount === 0.``` So that means, only at the very beginning. It runs in the inputModifier, and strips out the JSON and Story Card templates and edits the remaining opening story text substituting in values set in the JSON. It also handles setting up default values in case the player skips values.
In the example opening, if a placeholder has a missing '$', it is simply ignored by AID, so this works as a switch to turn off attributes.

A future feature is proper pronoun handling. But that is complicated.
