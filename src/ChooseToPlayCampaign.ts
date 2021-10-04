
// April 2021
// The blind / location - agnostic way to find solutions is to have an inv vs props table, and inv vs inv table, and a verb vs props table, and a verb vs invs table, then
// 1. Check the invs vs invs ? this is the lowest hanging fruit
// 2. Check the verbs vs invs ? this is the second lowest hanging fruit - if find something then go to 1.
// 3. Check the invs vs props ? this is the third lowest hanging fruit - if find a new inv, then go to 1.
// 3. Check the verbs vs props ? this is the fourth lowest hanging truit - if find something, then go to 1.
// 4. Ensure there is no PROPS VS PROPS because:
//     A.unless we  give the AI knowledge of locations, then a blind  brute force would take forever.
//     B.even if we did have knowledge of locations, it would mean creating a logic grid per location...which is easy - and doable.hmmn. 
//
// May 2021, regarding point number 4... Some puzzles are just like that, eg use hanging cable in powerpoint.
// // even in maniac mansion it was like use radtion suit with meteot etc.
//

import { Happener } from "./Happener";
import { PlayerAI } from "./PlayerAI";
import { GameReporter } from "./GameReporter";
import { Sleep } from "./Sleep";
import { Mix } from "./Mix";
import { SolutionNode } from "./SolutionNode";
import { ReadOnlyJsonInterface } from "./ReadOnlyJsonInterface";
import { ParseTokenizedCommandLineFromFromThreeStrings } from "./GetMixedObjectsAndVerbFromThreeStrings";
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
const prompt = promptSync();
import { levels } from './20210415JsonPrivate/All.json'
import { definitions } from './20210415JsonPrivate/AllSchema.json'
import { ReadOnlyJsonMultipleCombined } from "./ReadOnlyJsonMultipleCombined";
import { GetAnyErrorsFromObjectAvailability } from "./GetAnyErrorsFromObjectAvailability";
import _ from './20210415JsonPrivate/Gate/Gate.json';
import { SolutionNodeMap } from "./SolutionNodeMap";
import { ReadOnlyJsonSingle } from "./ReadOnlyJsonSingle";

class Section {
    constructor(happener:Happener, startingThings:Map<string, Set<string>>, solutionNodeMap: SolutionNodeMap) {
       
        this.prerequisiteFlags = [];
        this.prerequisiteType = "";
        this.sunsetFlags = [];
        this.sunsetType = "";
        this.flagSetUponCompletion = "";
        this.displayName = "";
        this.happener = happener;
        const numberOfAutopilotTurns = 0;
        this.player = new PlayerAI(this.happener, numberOfAutopilotTurns);
        this.solutionNodeMap = solutionNodeMap;
        this.startingThings = startingThings;
        this.isWon = false;
    }
    setWon() {
        this.isWon = true;
    }
    getWon() {
        return this.isWon;
    }

    prerequisiteFlags: string[];
    prerequisiteType: string;
    sunsetFlags: string[];
    sunsetType: string;
    flagSetUponCompletion: string;
    displayName: string; 
    happener: Happener;
    player: PlayerAI;
    startingThings:Map<string, Set<string>>;
    solutionNodeMap: SolutionNodeMap;
    private isWon: boolean;
}

class SectionCollection {
    private sections: Array<Section>;
    constructor() {
        this.sections = new Array<Section>();
    }

    array(): Array<Section> {
        return this.sections;
    }

    isActive(index: number): boolean {
        const gflags = new Set<string>();
        if (index < 0 || index >= this.sections.length)
            return false;
        for (let section of this.sections) {
            if (section.getWon())
                gflags.add(section.flagSetUponCompletion);
        }
        let prerequisitesCompleted = 0;
        for (let prerequisite of this.sections[index].prerequisiteFlags) {
            if (gflags.has(prerequisite))
                prerequisitesCompleted++;
        }

        let sunsetsCompleted = 0;
        for (let sunset of this.sections[index].sunsetFlags) {
            if (gflags.has(sunset))
                sunsetsCompleted++;
        }

        let isPrerequisiteSatisfied = false;
        switch (this.sections[index].prerequisiteType) {
            case definitions.condition_type.oneOrMore:
                isPrerequisiteSatisfied = prerequisitesCompleted >= 1;
                break;
            case definitions.condition_type.twoOrMore:
                isPrerequisiteSatisfied = prerequisitesCompleted >= 2;
                break;
            case definitions.condition_type.threeOrMore:
                isPrerequisiteSatisfied = prerequisitesCompleted >= 3;
                break;
            default:
                isPrerequisiteSatisfied = prerequisitesCompleted >= this.sections[index].prerequisiteFlags.length;
        }

        let isSunsetSatisfied = false;
        switch (this.sections[index].sunsetType) {
            case definitions.condition_type.oneOrMore:
                isSunsetSatisfied = sunsetsCompleted >= 1;
                break;
            case definitions.condition_type.twoOrMore:
                isSunsetSatisfied = sunsetsCompleted >= 2;
                break;
            case definitions.condition_type.threeOrMore:
                isSunsetSatisfied = sunsetsCompleted >= 3;
                break;
            default:
                isSunsetSatisfied = sunsetsCompleted >= this.sections[index].sunsetFlags.length;
        }

        //default to must have completed all
        const isActive = isPrerequisiteSatisfied && !isSunsetSatisfied;
        return isActive;
    }

    isWon(index: number): boolean {
        return this.sections[index].getWon();
    }

    getName(index: number): string {
        return this.sections[index].displayName;
    }
}

function PlaySingleSection(section: Section) {

    while (true) {
        // report current situation to cmd output
        const reporter = GameReporter.GetInstance();
        const flags = section.happener.GetCurrentlyTrueFlags();
        const invs = section.happener.GetCurrentVisibleInventory();
        const props = section.happener.GetCurrentVisibleProps();
        reporter.ReportFlags(flags);
        reporter.ReportInventory(invs);
        reporter.ReportScene(props);

        // Process all the autos
        ProcessAutos(section.happener, section.solutionNodeMap);

        // check have we won?
        if (section.happener.GetFlagValue("flag_win")) {
            section.setWon();
            break;
        }

        Sleep(500);

        // take input & handle null and escape character
        let input: string[] = section.player.GetNextCommand();
        if (input.length <= 1) {
            if (input.length == 1 && input[0] == 'b')
                return;// GetNextCommand returns ['b'] if the user chooses 'b'
            // this next line is only here to easily debug
            input = section.player.GetNextCommand();
            break;
        }

        // parse & handle parsing errors
        const commandLine = ParseTokenizedCommandLineFromFromThreeStrings(input, section.happener);
        if (commandLine.error.length) {
            console.log(input + " <-- Couldn't tokenize input, specifically " + commandLine.error);
            continue
        }

        // if all objects are available then execute
        const errors = GetAnyErrorsFromObjectAvailability(commandLine, section.happener.GetCurrentVisibleProps(), section.happener.GetCurrentVisibleInventory());
        if (errors.length == 0) {
            GameReporter.GetInstance().ReportCommand(input);
            section.happener.ExecuteCommand(commandLine);
        } else {
            console.log(errors);
        }
    }// end while (true) of playing game
    section.setWon();
    console.log("Success");
}

export function ChooseToPlayCampaign(): void {
    const sections = new SectionCollection();
    for (let level of levels) {
        let fileset =  new Array<string>();
        fileset.push(level.mainFile)
        for(let extra of level.extraFiles){
            fileset.push(extra);
        }
        let json = new ReadOnlyJsonMultipleCombined(fileset);
        let happener = new Happener(json);
        let s = new Section(happener, json.GetMapOfAllStartingThings(), json.GenerateSolutionNodesMappedByInput());
        s.prerequisiteFlags = level.prerequisiteFlags;
        s.prerequisiteType = level.prerequisiteType;
        s.flagSetUponCompletion = level.flagSetUponCompletion;
        s.displayName = level.displayName;
        s.sunsetFlags = level.sunsetFlags;
        s.sunsetType = level.sunsetType;
        sections.array().push(s);
    }

    while (true) {
        // list the sections to choose from
        for (let i = 0; i < sections.array().length; i++) {
            console.log("" + i + ". " + sections.getName(i) + (sections.isActive(i) ? "  active" : "  locked") + (sections.isWon(i) ? "  COMPLETE!" : "  incomplete"));
        }

        // ask which section they want to play?
        const choice = prompt("Choose an option or (b)ail: ").toLowerCase();
        if (choice == 'b')
            break;// break the while(true);
        const number = Number(choice);
        if (number < 0 || number >= sections.array().length) {
            console.log("out-of-range");
            break;
        }
        const s = sections.array()[number];
        PlaySingleSection(s);

    }// end while true of selecting a section

}// end fn

function ProcessAutos(happener:Happener, solutionNodeMap:SolutionNodeMap) {
    const flags = happener.GetCurrentlyTrueFlags();
    const invs = happener.GetCurrentVisibleInventory();
    const props = happener.GetCurrentVisibleProps();

    const autos = solutionNodeMap.GetAutos();
    for (const node of autos) {
        if(node.type == _.AUTO_FLAG1_CAUSES_IMPORT_OF_JSON){
            let json = new ReadOnlyJsonSingle(node.output);
            happener.MergeNewThingsFromScene(json);
            solutionNodeMap.MergeInNodesFromScene(json);
            continue;
        }
        let numberSatisified = 0;
        for (let inputName of node.inputHints) {
            if (inputName.startsWith("prop_")) {
                if (props.includes(inputName)) {
                    numberSatisified = numberSatisified + 1;
                }
            }
            else if (inputName.startsWith("inv_")) {
                if (invs.includes(inputName)) {
                    numberSatisified++;
                }
            } else if (inputName.startsWith("flag_")) {
                if (flags.includes(inputName)) {
                    numberSatisified++;
                }
            }
        };
        if (numberSatisified === node.inputHints.length) {
            if (node.output.startsWith("prop_")) {
                console.log("Auto: prop set visible " + node.output);
                happener.SetPropVisible(node.output, true);
            } else if (node.output.startsWith("flag_")) {
                console.log("Auto: flag set to true " + node.output);
                happener.SetFlagValue(node.output, 1);
            } else if (node.output.startsWith("inv_")) {
                console.log("Auto: inv set to visible " + node.output);
                happener.SetInvVisible(node.output, true);
            } 
        }
    }
}

