
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
import { SolutionNodeInput } from "./SolutionNodeInput";
import { ScenarioInterface } from "./ScenarioInterface";

export function ChooseToPlayThrough(scene:ScenarioInterface, numberOfAutopilotTurns: number): void {

    {
        const happener = new Happener(scene);
        const ai: PlayerAI = new PlayerAI(happener, numberOfAutopilotTurns);
        const autos = scene.GetSolutionNodesMappedByInput().GetAutos();
        
        while(true) {
            const invs = happener.GetCurrentVisibleInventory();
            GameReporter.GetInstance().ReportInventory(invs);
            const props = happener.GetCurrentVisibleProps();
            GameReporter.GetInstance().ReportScene(props);
            const Regs = happener.GetCurrentlyTrueFlags();
            GameReporter.GetInstance().ReportScene(props);

            autos.forEach((node: SolutionNode) => {
                let numberSatisified = 0;
                node.inputs.forEach((input: SolutionNodeInput) => {
                    if (input.inputName.startsWith("prop_")) {
                        if (props.includes(input.inputName)) {
                            numberSatisified = numberSatisified + 1;
                        }
                    }
                    else if (input.inputName.startsWith("inv_")) {
                        if (invs.includes(input.inputName)) {
                            numberSatisified++;
                        }
                    } else if (input.inputName.startsWith("reg_")) {
                        if (Regs.includes(input.inputName)) {
                            numberSatisified++;
                        }
                    }
                });
                if (numberSatisified === node.inputs.length) {
                    if (node.output.startsWith("prop_")) {
                        console.log("Auto: prop set visible " + node.output);
                        happener.SetPropVisible(node.output, true);
                    } else if (node.output.startsWith("reg_")) {
                        console.log("Auto: reg set to true " + node.output);
                        happener.SetRegValue(node.output, true);
                    } else if (node.output.startsWith("inv_")) {
                        console.log("Auto: inv set to visible " + node.output);
                        happener.SetInvVisible(node.output, true);
                    }
                }
            });

            Sleep(500);

            let input: string[] = ai.GetNextCommand();

            if (input.length === 0) {
                // null command means ai can't find another guess.
                // so lets just see what's going on here
                input = ai.GetNextCommand();
                break;
            }
     

            // 
            const objects = scene.GetMixedObjectsAndVerbFromThreeStrings(input);

            // handle errors
            if (objects.type.toString().startsWith("Error")) {
                console.log(objects.type.toString() + " blah");
                break;
            }

            // handle more errors
            const visibleInvs = happener.GetCurrentVisibleInventory();
            const visibleProps = happener.GetCurrentVisibleProps();
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
            happener.ExecuteCommand(objects);

        }
        console.log("Success");
    }
}