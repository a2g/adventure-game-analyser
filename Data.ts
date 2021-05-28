import { SolutionNodeMap } from './SolutionNodeMap';
import { SolutionNode } from './SolutionNode';
import { assert } from 'console';
import data from '../20210415JsonPrivate/data/Data.json';
import objects from '../20210415JsonPrivate/data/schema/objects/Objects.json'
import _ from '../20210415JsonPrivate/data/schema/InstructionSet.json';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb';
import { Happenings } from './Happenings';
import { Happening } from './Happening';
import { Happen } from './Happen';
import { Mix } from './Mix';

function Stringify(name: string | undefined):string{
    return name ? name : "";
}
export class Data {
    static GetMixedObjectsAndVerbFromThreeStrings(strings: string[]): MixedObjectsAndVerb {
        const verb = strings[0].toLowerCase();

        if (verb === "grab") {
            if (objects.definitions.prop_type.enum.includes(strings[1]))
                return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, strings[1], "");
            return new MixedObjectsAndVerb(Mix.ErrorGrabButNoProp, "", "", "");
        } else if (verb === "toggle") {
            if (objects.definitions.inv_type.enum.includes(strings[1]))
                return new MixedObjectsAndVerb(Mix.SingleVsInv, verb, strings[1], "");
            if (objects.definitions.prop_type.enum.includes(strings[1]))
                return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, strings[1], "");
            return new MixedObjectsAndVerb(Mix.ErrorToggleButNoInvOrProp, "", "", "");
        } else if (verb === "use") {
            if (objects.definitions.inv_type.enum.includes(strings[1]) && objects.definitions.inv_type.enum.includes(strings[2]))
                return new MixedObjectsAndVerb(Mix.InvVsInv, verb, strings[1], strings[2]);
            if (objects.definitions.inv_type.enum.includes(strings[1]) && objects.definitions.prop_type.enum.includes(strings[2]))
                return new MixedObjectsAndVerb(Mix.InvVsProp, verb, strings[1], strings[2]);
            if (objects.definitions.prop_type.enum.includes(strings[1]) && objects.definitions.prop_type.enum.includes(strings[2]))
                return new MixedObjectsAndVerb(Mix.PropVsProp, verb, strings[1], strings[2]);
        }
        return new MixedObjectsAndVerb(Mix.ErrorVerbNotIdentified, "", "", "");
    }

    

    static GetHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null {
        const play = new Happenings();
        for (let i = 0; i < data.reactions.length; i++) {
            const reaction = data.reactions[i];
            switch (reaction.type) {
                case _.INV1_AND_INV2_FORM_INV3:
                    if (objects.Match("Use", reaction.inv1, reaction.inv2)) {
                        play.text = "The " + reaction.inv1 + " and the " + reaction.inv2 + " form an" + reaction.inv3 + ".";
                        play.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                        play.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv2)));
                        play.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv3)));
                        return play;
                    }
                    break;
                case _.INV1_AND_INV2_GENERATE_INV3:
                    if (objects.Match("Use", reaction.inv1, reaction.inv2)) {
                        play.text = "The " + reaction.inv1 + " and the " + reaction.inv2 + " generate an" + reaction.inv3 + ".";
                        play.array.push(new Happening(Happen.InvStays, Stringify(reaction.inv1)));
                        play.array.push(new Happening(Happen.InvStays, Stringify(reaction.inv2)));
                        play.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv3)));
                        return play;
                    }
                    break;
                case _.INV1_BECOMES_INV2_VIA_KEEPING_INV3:
                    if (objects.Match("Use", reaction.inv1, reaction.inv3)) {
                        play.text = "The " + reaction.inv1 + " and the " + reaction.inv2 + " generate an" + reaction.inv3 + ".";
                        play.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                        play.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv2)));
                        play.array.push(new Happening(Happen.InvStays, Stringify(reaction.inv3)));
                        return play;
                    }
                    break;
                case _.INV1_BECOMES_INV2_VIA_KEEPING_PROP1:
                    if (objects.Match("Use", reaction.inv1, reaction.prop1)) {
                        play.text = "The " + reaction.inv1 + " has become a  " + reaction.inv2 + ".";
                        play.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                        play.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv2)));
                        play.array.push(new Happening(Happen.PropStays, Stringify(reaction.prop1)));
                        return play;
                    }
                    break;
                case _.INV1_BECOMES_INV2_VIA_LOSING_INV3:
                    if (objects.Match("Use", reaction.inv1, reaction.inv3)) {
                        play.text = "The " + reaction.inv1 + " has become a  " + reaction.inv2 + ".";
                        play.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                        play.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv2)));
                        play.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv3)));
                        return play;
                    }
                    break;
                case _.INV1_WITH_PROP1_REVEALS_PROP2_KEPT_ALL:
                    if (objects.Match("Use", reaction.inv1, reaction.prop1)) {
                        play.text = "The " + reaction.inv1 + " has become a  " + reaction.inv2 + ".";
                        play.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                        play.array.push(new Happening(Happen.PropStays, Stringify(reaction.prop1)));
                        play.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                        //play.checks.push(new CheckableItem(Check.VerbVsProp, "Grab", reaction.prop1));
                        return play;
                    }
                    break;
                case _.OBTAIN_INV1_VIA_PROP1_WITH_PROP2_LOSE_PROPS:
                    if (objects.Match("Use", reaction.prop1, reaction.prop2)) {
                        play.text = "The " + reaction.inv1 + " has become a  " + reaction.inv2 + ".";
                        play.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv1)));
                        play.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        play.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop2)));
                        //play.checks.push(new CheckableItem(Check.VerbVsProp, "Grab", reaction.prop1));
                        return play;
                    }
                    break;
                case _.PROP1_BECOMES_PROP2_VIA_KEEPING_INV1:
                    if (objects.Match("Use", reaction.prop1, reaction.inv1)) {
                        play.text = "The " + reaction.inv1 + " has become a  " + reaction.inv2 + ".";
                        play.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        play.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                        play.array.push(new Happening(Happen.InvStays, Stringify(reaction.inv1)));
                        //play.checks.push(new CheckableItem(Check.VerbVsProp, "Grab", reaction.prop1));
                    }
                    break;
                case _.PROP1_BECOMES_PROP2_VIA_KEEPING_PROP3:
                    if (objects.Match("Use", reaction.prop1, reaction.inv1)) {
                        play.text = "The " + reaction.prop1 + " has become a  " + reaction.prop2 + ".";
                        play.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        play.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                        play.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                        //play.checks.push(new CheckableItem(Check.VerbVsProp, "Grab", reaction.prop1));
                    }
                    break;
                case _.PROP1_BECOMES_PROP2_VIA_LOSING_INV1:
                    if (objects.Match("Use", reaction.prop1, reaction.inv1)) {
                        play.text = "The " + reaction.prop1 + " has become a  " + reaction.prop2 + ".";
                        play.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        play.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                        play.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                        //play.checks.push(new CheckableItem(Check.VerbVsProp, "Grab", reaction.prop1));
                    }
                    break;
                case _.PROP1_BECOMES_PROP2_VIA_LOSING_PROP3:
                    if (objects.Match("Use", reaction.prop1, reaction.inv1)) {
                        play.text = "The " + reaction.prop1 + " has become a  " + reaction.prop2 + ".";
                        play.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        play.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                        play.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop3)));
                        //play.checks.push(new CheckableItem(Check.VerbVsProp, "Grab", reaction.prop1));
                    }
                    break;
                case _.PROP1_BECOMES_PROP2_WHEN_GRAB_INV1:
                    if (objects.Match("Grab", reaction.prop1,"")) {
                        play.text = "You now have a " + reaction.inv1 +
                            "\n You notice the " + reaction.prop1 + " has now become a " + reaction.prop2;
                        play.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        play.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                        play.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                        return play;
                    }
                    break;
                case _.PROP1_GOES_WHEN_GRAB_INV1:
                    if (objects.Match("Grab", reaction.prop1,"")) {
                        play.text = "You now have a " + reaction.inv1;
                        play.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        play.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                        return play;
                    }
                    break;
                case _.TOGGLE_PROP1_BECOMES_PROP2:
                    if (objects.Match("Toggle", reaction.prop1,"")) {
                        play.text = "There is now a " + reaction.prop2;
                        play.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        play.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                    }
                    break;
            }
        }
        return null;
    }
    static GetArrayOfSingleObjectVerbs(): Array<string> {
        return ["grab", "toggle"];
    }
    static GetArrayOfVisibilitiesOfSingleObjectVerbs(): Array<boolean> {
        return [true,true];
    }
    static GetArrayOfProps(): Array<string> {
        return objects.definitions.prop_type.enum;
    }
    static GetArrayOfInvs(): Array<string> {
        return objects.definitions.inv_type.enum;
    }
    static GetArrayOfRegs(): Array<string> {
        return objects.definitions.reg_type.enum;
    }
    static GetArrayOfPropVisibilities(): Array<boolean> {

        // preen starting set from JSON
        const startingSet = new Set<string>();
            data.startingProps.forEach(function (value: { prop: string; }, index: number, array: { prop: string; }[]): void {
                startingSet.add(value.prop);
            });

        // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
        const visibilities = new Array<boolean>();
        objects.definitions.prop_type.enum.forEach((prop: string) => {
            const isVisible = startingSet.has(prop);
            visibilities.push(isVisible);
        });

        return visibilities;
    }

    static GetArrayOfInvVisibilities(): Array<boolean> {

        // preen starting set from JSON
        const startingSet = new Set<string>();
        data.startingInvs.forEach(function (value: { prop: string; }, index: number, array: { prop: string; }[]): void {
            startingSet.add(value.prop);
        });

        // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
        const visibilities = new Array<boolean>();
        objects.definitions.inv_type.enum.forEach((prop: string) => {
            const isVisible = startingSet.has(prop);
            visibilities.push(isVisible);
        });

        return visibilities;
    }

    static GetSolutionNodeMap(): SolutionNodeMap {
        const mapOfTransactionsByInput = new SolutionNodeMap(null);
        for (let i = 0; i < data.reactions.length; i++) {
            const type = data.reactions[i].type;
            switch (type) {
                case _.INV1_AND_INV2_FORM_INV3:
                    {
                        // losing all
                        const inputA = "" + data.reactions[i].inv1;
                        const inputB = "" + data.reactions[i].inv2;
                        const output = "" + data.reactions[i].inv3;
                        mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, inputA, inputB));
                    }
                    break;
                case _.INV1_AND_INV2_GENERATE_INV3:
                    {
                        // losing none
                        const inputA = "" + data.reactions[i].inv1;
                        const inputB = "" + data.reactions[i].inv2;
                        const output = "" + data.reactions[i].inv3;
                        mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, inputA, inputB));
                    }
                    break;
                case _.INV1_WITH_PROP1_REVEALS_PROP2_KEPT_ALL:
                    {
                        const inputA = "" + data.reactions[i].inv1;
                        const inputB = "" + data.reactions[i].prop1;
                        const output = "" + data.reactions[i].prop2;
                        mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, inputA, inputB));
                    }
                    break;
                case _.INV1_BECOMES_INV2_VIA_KEEPING_INV3:
                case _.INV1_BECOMES_INV2_VIA_LOSING_INV3:
                    {
                        // losing inv
                        const inputA = "" + data.reactions[i].inv1;
                        const output = "" + data.reactions[i].inv2;
                        const inputB = "" + data.reactions[i].inv3;
                        mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, inputA, inputB));
                    }
                    break;

                case _.INV1_BECOMES_INV2_VIA_KEEPING_PROP1:
                    {
                        // keeping prop1
                        const inputA = "" + data.reactions[i].inv1;
                        const output = "" + data.reactions[i].inv2;
                        const inputB = "" + data.reactions[i].prop1;
                        mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, inputA, inputB));
                    }
                    break;
                case _.PROP1_BECOMES_PROP2_VIA_KEEPING_INV1:
                case _.PROP1_BECOMES_PROP2_VIA_LOSING_INV1:
                    {
                        const inputA = "" + data.reactions[i].prop1;
                        const output = "" + data.reactions[i].prop2;
                        const inputB = "" + data.reactions[i].inv1;
                        mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, inputA, inputB));
                    }
                    break;
                case _.PROP1_GOES_WHEN_GRAB_INV1:
                    {
                        const input = "" + data.reactions[i].prop1;
                        const output = "" + data.reactions[i].inv1;
                        mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, input));
                    }
                    break;
                case _.PROP1_BECOMES_PROP2_WHEN_GRAB_INV1:
                    {
                        // This is a weird one, because there are two real-life outputs
                        // but only one puzzle output. I forget how I was going to deal with this.
                        const inputA = "" + data.reactions[i].prop1;
                        //const inputB = "" + reactionsFile.reactions[i].prop2;
                        const output = "" + data.reactions[i].inv1;
                        mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, inputA));
                    }
                    break;
                case _.TOGGLE_PROP1_BECOMES_PROP2:
                    {
                        const input = "" + data.reactions[i].prop1;
                        const output = "" + data.reactions[i].prop2;
                        mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, input));
                    }
                    break;
                case _.PROP1_BECOMES_PROP2_VIA_KEEPING_PROP3:
                case _.PROP1_BECOMES_PROP2_VIA_LOSING_PROP3:
                    {
                        const inputA = "" + data.reactions[i].prop1;
                        const output = "" + data.reactions[i].prop2;
                        const inputB = "" + data.reactions[i].prop3;
                        mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, inputA, inputB));
                    }
                    break;
                case _.AUTO_PROP1_BECOMES_PROP2_VIA_PROPS:
                    {
                        const input = "" + data.reactions[i].prop1;
                        const output = "" + data.reactions[i].prop2;
                        const prop1 = "" + data.reactions[i].prop3;
                        const prop2 = "" + data.reactions[i].prop4;
                        const prop3 = "" + data.reactions[i].prop5;
                        const prop4 = "" + data.reactions[i].prop6;
                        const prop5 = "" + data.reactions[i].prop7;
                        mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, input, prop1, prop2, prop3, prop4, prop5));
                    }
                    break;
                case _.OBTAIN_INV1_VIA_PROP1_WITH_PROP2_LOSE_PROPS:
                    {
                        const output = "" + data.reactions[i].inv1;
                        const input1 = "" + data.reactions[i].prop1;
                        const input2 = "" + data.reactions[i].prop2;
                        mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, input1, input2));
                    }
                    break;

                case _.AUTO_REG1_TRIGGERS_REG2:
                    {
                        const input = "" + data.reactions[i].reg1;
                        const output = "" + data.reactions[i].reg2;
                        mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, input));
                    }
                    break;
                case _.AUTO_REG1_TRIGGERED_BY_PROPS:
                    {
                        const output = "" + data.reactions[i].reg1;
                        const prop1 = "" + data.reactions[i].prop1;
                        const prop2 = "" + data.reactions[i].prop2;
                        const prop3 = "" + data.reactions[i].prop3;
                        const prop4 = "" + data.reactions[i].prop4;
                        const prop5 = "" + data.reactions[i].prop5;
                        const prop6 = "" + data.reactions[i].prop6;
                        mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, prop1, prop2, prop3, prop4, prop5, prop6));
                    }
                    break;
                case _.HACK_TO_STOP_ALLOW_TS_TO_IMPORT_THIS_FILE:
                    break;
                default:
                    assert(false && type && "We didn't handle a type that we're supposed to. Check to see if constant names are the same as their values in the schema.");
            }// end switch
        }// end loop
        return mapOfTransactionsByInput;
    }


}