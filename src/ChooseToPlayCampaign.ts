
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
import { GetMixedObjectsAndVerbFromThreeStrings } from "./GetMixedObjectsAndVerbFromThreeStrings";
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
const prompt = promptSync();
import { levels } from './20210415JsonPrivate/All.json'
import {definitions} from './20210415JsonPrivate/AllSchema.json'
import { SceneMultipleCombined } from "./SceneMultipleCombined";  

class Section {
    constructor(mainFile:string, extraFiles: string[]) {
        this.fileset = extraFiles;
        this.fileset.push(mainFile);
        this.prerequisiteArray = [];
        this.prerequisiteType = "";
        this.flagSetUponCompletion = "";
        this.name = "";
        this.scene = new SceneMultipleCombined(this.fileset);
        this.happener = new Happener(this.scene);
        const numberOfAutopilotTurns = 0;
        this.ai = new PlayerAI(this.happener, numberOfAutopilotTurns);
        this.isWon = false;
    }
    setWon() {
        this.isWon = true;
    }
    getWon() {
        return this.isWon;
    }

    fileset: string[];
    prerequisiteArray: string[];
    prerequisiteType: string;
    flagSetUponCompletion: string;
    name: string;
    scene: SceneInterface;
    happener: Happener;
    ai: PlayerAI;
    private isWon: boolean;
}

class SectionCollection{
    private sections : Array<Section>;
    constructor(){
        this.sections = new Array<Section>();
    }

    array() : Array<Section>{
        return this.sections;
    }

    isActive(index:number):boolean{
        const gflags = new Set<string>();
        if(index<0 || index>= this.sections.length)
            return false;
        for(let section  of this.sections){
            if(section.getWon())
                gflags.add(section.flagSetUponCompletion);
        }
        let numberCompleted = 0;
        for(let prerequisite of this.sections[index].prerequisiteArray){
            if(gflags.has(prerequisite))
                numberCompleted++;
        }
        let type = this.sections[index].prerequisiteType;
        switch (type) {
            case definitions.prerequisite_type.oneRequired:
                return numberCompleted >= 1;
            case definitions.prerequisite_type.twoRequired:
                return numberCompleted >= 2;
            case definitions.prerequisite_type.threeRequired:
                return numberCompleted >= 3;
        }
        //default to must have completed all
        return numberCompleted==this.sections[index].prerequisiteArray.length;
    }

    isWon(index:number):boolean{
        return this.sections[index].getWon();
    }

    getName(index:number):string{
        return this.sections[index].name;
    }
}
function PlaySingleSection(s: Section) {

    while (true) {
        // Process all the autos
        const autos = s.scene.GetSolutionNodesMappedByInput().GetAutos();

        const flags = s.happener.GetCurrentlyTrueFlags();
        GameReporter.GetInstance().ReportFlags(flags);
        const invs = s.happener.GetCurrentVisibleInventory();
        GameReporter.GetInstance().ReportInventory(invs);
        const props = s.happener.GetCurrentVisibleProps();
        GameReporter.GetInstance().ReportScene(props);
        autos.forEach((node: SolutionNode) => {
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
                    s.happener.SetPropVisible(node.output, true);
                } else if (node.output.startsWith("flag_")) {
                    console.log("Auto: flag set to true " + node.output);
                    s.happener.SetFlagValue(node.output, 1);
                } else if (node.output.startsWith("inv_")) {
                    console.log("Auto: inv set to visible " + node.output);
                    s.happener.SetInvVisible(node.output, true);
                }
            }
        });

        // check have we won?
        if (s.happener.GetFlagValue("flag_win")) {
            s.setWon();
            break;
        }

        Sleep(500);

        let input: string[] = s.ai.GetNextCommand();
        if (input.length === 0) {
            // null command means ai can't find another guess.
            // so lets just see what's going on here
            input = s.ai.GetNextCommand();
            break;
        }
        if (input.length == 1 && input[0] == 'b')
            return;// don't set as won

        // 
        const objects = GetMixedObjectsAndVerbFromThreeStrings(input, s.scene);

        // handle errors
        if (objects.type.toString().startsWith("Error")) {
            console.log(objects.type.toString() + " blah");
            return;// don't set as won
        }

        // handle more errors
        const visibleInvs = s.happener.GetCurrentVisibleInventory();
        const visibleProps = s.happener.GetCurrentVisibleProps();
        const isObjectAInVisibleInvs = visibleInvs.includes(objects.objectA);
        const isObjectAInVisibleProps = visibleProps.includes(objects.objectA);
        const isObjectBInVisibleInvs = visibleInvs.includes(objects.objectB);
        const isObjectBInVisibleProps = visibleProps.includes(objects.objectB);

        switch (objects.type) {
            case Mix.InvVsInv:
                if (!isObjectAInVisibleInvs || !isObjectBInVisibleInvs) {
                    console.log("One of those inventory items is not visible!");
                    continue;
                }
                break;
            case Mix.InvVsProp:
                if (!isObjectAInVisibleInvs || !isObjectBInVisibleProps) {
                    console.log("One of those items is not visible!");
                    continue;
                }
                break;
            case Mix.PropVsProp:
                if (!isObjectAInVisibleProps || !isObjectBInVisibleProps) {
                    console.log("One of those props is not visible!");
                    continue;
                }
                break;
            case Mix.SingleVsInv:
                if (!isObjectAInVisibleInvs) {
                    console.log("That inv is not visible!");
                    continue;
                }
                break;
            case Mix.SingleVsProp:
                if (!isObjectAInVisibleProps) {
                    console.log("That prop is not visible!");
                    continue;
                }
                break;
        }

        GameReporter.GetInstance().ReportCommand(input);

        // execute command - it will handle callbacks itself
        s.happener.ExecuteCommand(objects);
    }// end while (true) of playing game
    s.setWon();
    console.log("Success");
}

export function ChooseToPlayCampaign(): void {
    const sections = new SectionCollection();
    for (let level of levels) {
        let s = new Section(level.mainFile, level.extraFiles);
        s.prerequisiteArray = level.prerequisiteFlags;
        s.prerequisiteType = level.prerequisiteType;
        s.flagSetUponCompletion = level.flagSetUponCompletion;
        s.name = level.displayName;
        sections.array().push(s);
    }

    while (true) {
        // list the sections to choose from
        for (let i = 0; i < sections.array().length; i++) {
            console.log("" + i + ". " + sections.getName(i) + (sections.isActive(i) ? "  active" : "  locked")+ (sections.isWon(i) ? "  COMPLETE!" : "  incomplete"));
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
