import { Happener } from "./Happener";
import _ from './20210415JsonPrivate/Gate/Gate.json';
import { SolutionNodeMap } from "./SolutionNodeMap";
import { ReadOnlyJsonSingle } from "./ReadOnlyJsonSingle";


export function ProcessAutos(happener: Happener, solutionNodeMap: SolutionNodeMap) {
    const flags = happener.GetCurrentlyTrueFlags();
    const invs = happener.GetCurrentVisibleInventory();
    const props = happener.GetCurrentVisibleProps();

    const autos = solutionNodeMap.GetAutos();
    for (const node of autos) {
        if (node.type == _.AUTO_FLAG1_CAUSES_IMPORT_OF_JSON) {
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
