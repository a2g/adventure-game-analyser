import { Mix } from "./Mix";
import { MixedObjectsAndVerb } from "./MixedObjectsAndVerb";
import { SceneInterface} from "./SceneInterface";

   export function GetMixedObjectsAndVerbFromThreeStrings(strings: string[], scene: SceneInterface) : MixedObjectsAndVerb {
    const verb = strings[0].toLowerCase();

    if (verb === "grab") {
        if (scene.GetArrayOfProps().includes(strings[1]))
            return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, strings[1], "", "GetMixedObjectsAndVerbFromThreeStrings");
        else if (scene.GetArrayOfProps().includes("prop_" + strings[1]))
            return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, "prop_" + strings[1], "", "GetMixedObjectsAndVerbFromThreeStrings");
        return new MixedObjectsAndVerb(Mix.ErrorGrabButNoProp, "", "", "", "GetMixedObjectsAndVerbFromThreeStrings");
    } else if (verb === "toggle") {
        if (scene.GetArrayOfProps().includes(strings[1]))
            return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, strings[1], "", "GetMixedObjectsAndVerbFromThreeStrings");
        else if (scene.GetArrayOfProps().includes("prop_" + strings[1]))
            return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, "prop_" + strings[1], "", "GetMixedObjectsAndVerbFromThreeStrings");
        else if (scene.GetArrayOfInvs().includes(strings[1]))
            return new MixedObjectsAndVerb(Mix.SingleVsInv, verb, strings[1], "", "GetMixedObjectsAndVerbFromThreeStrings");
        else if (scene.GetArrayOfInvs().includes("inv_" + strings[1]))
            return new MixedObjectsAndVerb(Mix.SingleVsInv, verb, "inv_" + strings[1], "", "GetMixedObjectsAndVerbFromThreeStrings");
        return new MixedObjectsAndVerb(Mix.ErrorToggleButNoInvOrProp, "", "", "", "GetMixedObjectsAndVerbFromThreeStrings");
    } else if (verb === "use") {
        if (scene.GetArrayOfInvs().includes(strings[1]) && scene.GetArrayOfInvs().includes(strings[2]))
            return new MixedObjectsAndVerb(Mix.InvVsInv, verb, strings[1], strings[2], "GetMixedObjectsAndVerbFromThreeStrings");
        else if (scene.GetArrayOfInvs().includes("inv_" + strings[1]) && scene.GetArrayOfInvs().includes("inv_" + strings[2]))
            return new MixedObjectsAndVerb(Mix.InvVsInv, verb, "inv_" + strings[1], "inv_" + strings[2],"GetMixedObjectsAndVerbFromThreeStrings");
        else if (scene.GetArrayOfInvs().includes(strings[1]) && scene.GetArrayOfProps().includes(strings[2]))
            return new MixedObjectsAndVerb(Mix.InvVsProp, verb, strings[1], strings[2],"GetMixedObjectsAndVerbFromThreeStrings");
        else if (scene.GetArrayOfInvs().includes("inv_" + strings[1]) && scene.GetArrayOfProps().includes("prop_" + strings[2]))
            return new MixedObjectsAndVerb(Mix.InvVsProp, verb, "inv_" + strings[1], "prop_" + strings[2],"GetMixedObjectsAndVerbFromThreeStrings");
        else if (scene.GetArrayOfProps().includes("prop_" + strings[1]) && scene.GetArrayOfProps().includes("prop_" + strings[2]))
            return new MixedObjectsAndVerb(Mix.PropVsProp, verb, "prop_" + strings[1], "prop_" + strings[2],"GetMixedObjectsAndVerbFromThreeStrings");
    }
    return new MixedObjectsAndVerb(Mix.ErrorVerbNotIdentified, "", "", "", "GetMixedObjectsAndVerbFromThreeStrings worst case");;
}
function ScenarioInterface(strings: any, arg1: any, scene: any, ScenarioInterface: any) {
    throw new Error("Function not implemented.");
}

function SceneInterface(strings: any, arg1: any, scene: any, SceneInterface: any) {
    throw new Error("Function not implemented.");
}

