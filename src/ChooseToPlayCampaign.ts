
// April 2021
// The blind / location - agnostic way to find solutions is to have an inv vs props table, and inv vs inv table, and a verb vs props table, and a verb vs invs table, then
// 1. Check the invs vs invs ? this is the lowest hanging fruit
// 2. Check the verbs vs invs ? this is the second lowest hanging fruit - if find something then go to 1.
// 3. Check the invs vs props ? this is the third lowest hanging fruit - if find a new inv, then go to 1.
// 3. Check the verbs vs props ? this is the fourth lowest hanging truit - if find something, then go to 1.
// 4. Ensure there is no PROPS VS PROPS because:
//     A.unless we  give the AI knowledge of locations, then a blind  brute force would take forever.
//     B.even if we did have knowledge of locations, it would mean creating a truth table per location...which is easy - and doable.hmmn. 
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
import { SceneInterface } from "./SceneInterface";
import { ParseTokenizedCommandLineFromFromThreeStrings } from "./GetMixedObjectsAndVerbFromThreeStrings";
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
const prompt = promptSync();
import { levels } from './20210415JsonPrivate/All.json'
import { definitions } from './20210415JsonPrivate/AllSchema.json'
import { SceneMultipleCombined } from "./SceneMultipleCombined";
import { MixedObjectsAndVerb } from "./MixedObjectsAndVerb";

class Section {
    constructor(mainFile: string, extraFiles: string[]) {
        this.fileset = extraFiles;
        this.fileset.push(mainFile);
        this.prerequisiteFlags = [];
        this.prerequisiteType = "";
        this.sunsetFlags = [];
        this.sunsetType = "";
        this.flagSetUponCompletion = "";
        this.displayName = "";
        this.scene = new SceneMultipleCombined(this.fileset);
        this.happener = new Happener(this.scene);
        const numberOfAutopilotTurns = 0;
        this.player = new PlayerAI(this.happener, numberOfAutopilotTurns);
        this.isWon = false;
    }
    setWon() {
        this.isWon = true;
    }
    getWon() {
        return this.isWon;
    }

    fileset: string[];
    prerequisiteFlags: string[];
    prerequisiteType: string;
    sunsetFlags: string[];
    sunsetType: string;
    flagSetUponCompletion: string;
    displayName: string;
    scene: SceneInterface;
    happener: Happener;
    player: PlayerAI;
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

function PlaySingleSection(s: Section) {

    while (true) {
        // report current situation to cmd output
        const reporter = GameReporter.GetInstance();
        const flags = s.happener.GetCurrentlyTrueFlags();
        const invs = s.happener.GetCurrentVisibleInventory();
        const props = s.happener.GetCurrentVisibleProps();
        reporter.ReportFlags(flags);
        reporter.ReportInventory(invs);
        reporter.ReportScene(props);

        // Process all the autos
        ProcessAutos(s);

        // check have we won?
        if (s.happener.GetFlagValue("flag_win")) {
            s.setWon();
            break;
        }

        Sleep(500);

        // take input & handle null and escape character
        let input: string[] = s.player.GetNextCommand();
        if (input.length <= 1) {
            if (input.length == 1 && input[0] == 'b')
                return;// GetNextCommand returns ['b'] if the user chooses 'b'
            // this next line is only here to easily debug
            input = s.player.GetNextCommand();
            break;
        }
        
        // parse & handle parsing errors
        const commandLine = ParseTokenizedCommandLineFromFromThreeStrings(input, s.scene);
        if (commandLine.error.length) {
            console.log(input + " <-- Couldn't tokenize input, specifically "+commandLine.error);
            continue
        }

        // if all objects are available then execute
        const errors = GetAnyErrorsFromObjectAvailability(commandLine, s.happener);
        if (errors.length == 0) {
            GameReporter.GetInstance().ReportCommand(input);
            s.happener.ExecuteCommand(commandLine);
        } else {
            console.log(errors);
        }
    }// end while (true) of playing game
    s.setWon();
    console.log("Success");
}

export function ChooseToPlayCampaign(): void {
    const sections = new SectionCollection();
    for (let level of levels) {
        let s = new Section(level.mainFile, level.extraFiles);
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

function GetAnyErrorsFromObjectAvailability(objects: MixedObjectsAndVerb, happener: Happener): string {
    const visibleInvs = happener.GetCurrentVisibleInventory();
    const visibleProps = happener.GetCurrentVisibleProps();
    const isObjectAInVisibleInvs = visibleInvs.includes(objects.objectA);
    const isObjectAInVisibleProps = visibleProps.includes(objects.objectA);
    const isObjectBInVisibleInvs = visibleInvs.includes(objects.objectB);
    const isObjectBInVisibleProps = visibleProps.includes(objects.objectB);

    const type = objects.type;
    if (type === Mix.InvVsInv && !isObjectAInVisibleInvs || !isObjectBInVisibleInvs) {
        return "One of those inventory items is not visible!";
    } else if (type === Mix.InvVsProp && !isObjectAInVisibleInvs || !isObjectBInVisibleProps) {
        return "One of those items is not visible!";
    } else if (type == Mix.PropVsProp && !isObjectAInVisibleProps || !isObjectBInVisibleProps) {
        return "One of those props is not visible!";
    } else if (type === Mix.SingleVsInv && !isObjectAInVisibleInvs) {
        return "That inv is not visible!";
    } else if (type === Mix.SingleVsProp && !isObjectAInVisibleProps) {
        return "That prop is not visible!";
    }

    return "";// no error!
}

function ProcessAutos(s: Section) {
    const flags = s.happener.GetCurrentlyTrueFlags();
    const invs = s.happener.GetCurrentVisibleInventory();
    const props = s.happener.GetCurrentVisibleProps();
    
    const autos = s.scene.GetSolutionNodesMappedByInput().GetAutos();
    for (const autonode of autos) {
        let numberSatisified = 0;
        for (let inputName of autonode.inputHints) {
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
        if (numberSatisified === autonode.inputHints.length) {
            if (autonode.output.startsWith("prop_")) {
                console.log("Auto: prop set visible " + autonode.output);
                s.happener.SetPropVisible(autonode.output, true);
            } else if (autonode.output.startsWith("flag_")) {
                console.log("Auto: flag set to true " + autonode.output);
                s.happener.SetFlagValue(autonode.output, 1);
            } else if (autonode.output.startsWith("inv_")) {
                console.log("Auto: inv set to visible " + autonode.output);
                s.happener.SetInvVisible(autonode.output, true);
            }
        }
    }
}

