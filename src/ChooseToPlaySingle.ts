import { Happener } from "./Happener";
import { ReadOnlyJsonInterface } from "./ReadOnlyJsonInterface";
import { PlayPlayable } from "./PlayPlayable";
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
import { Playable } from "./Playable";
import { PlayerAI } from "./PlayerAI";
const prompt = promptSync();

export function ChooseToPlaySingleSection(json: ReadOnlyJsonInterface, numberOfAutopilotTurns: number): void {

    let happener = new Happener(json);
    const player = new PlayerAI(happener, numberOfAutopilotTurns);
    let session = new Playable(player, happener,  json.GenerateSolutionNodesMappedByInput());
       
    PlayPlayable(session);
}
