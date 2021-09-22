import { Mix } from "./Mix";
import { MixedObjectsAndVerb } from "./MixedObjectsAndVerb";
import { SceneInterface } from "./SceneInterface";

export function ParseTokenizedCommandLineFromFromThreeStrings(strings: string[], scene: SceneInterface): MixedObjectsAndVerb {
    const verb = strings[0].toLowerCase();

    const is1InPropsRaw = scene.GetArrayOfProps().includes(strings[1]);
    const is1InPropsPrefixed = scene.GetArrayOfProps().includes("prop_" + strings[1]);
    const is1InInvsRaw = scene.GetArrayOfInvs().includes(strings[1])
    const is1InInvsPrefixed = scene.GetArrayOfInvs().includes("inv_" + strings[1]);
    const is2InPropsRaw = scene.GetArrayOfProps().includes(strings[2]);
    const is2InPropsPrefixed = scene.GetArrayOfProps().includes("prop_" + strings[2]);
    const is2InInvsRaw = scene.GetArrayOfInvs().includes(strings[2])
    const is2InInvsPrefixed = scene.GetArrayOfInvs().includes("inv_" + strings[2]);

    if (verb === "grab") {// no combinations needed
        if (is1InPropsRaw)
            return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, strings[1], "", "");
        else if (is1InPropsPrefixed)
            return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, "prop_" + strings[1], "", "Couldn't recognise '" + strings[1] + "' as something to grab");
        return new MixedObjectsAndVerb(Mix.ErrorGrabButNoProp, "", "", "", "");
    } else if (verb === "toggle") {// no combinations needed
        if (is1InPropsRaw)
            return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, strings[1], "", "");
        else if (is1InPropsPrefixed)
            return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, "prop_" + strings[1], "", "");
        else if (is1InInvsRaw)
            return new MixedObjectsAndVerb(Mix.SingleVsInv, verb, strings[1], "", "");
        else if (is1InInvsPrefixed)
            return new MixedObjectsAndVerb(Mix.SingleVsInv, verb, "inv_" + strings[1], "", "");
        return new MixedObjectsAndVerb(Mix.ErrorToggleButNoInvOrProp, "", "", "", "Couldn't recognise '" + strings[1] + "' as something to toggle");
    } else if (verb === "use") {
        // pure raw
        if (is1InInvsRaw && is2InInvsRaw)// a
            return new MixedObjectsAndVerb(Mix.InvVsInv, verb, strings[1], strings[2], "");
        else if (is1InInvsRaw && is2InPropsRaw)// b
            return new MixedObjectsAndVerb(Mix.InvVsProp, verb, strings[1], strings[2], "");
        else if (is2InInvsRaw && is1InPropsRaw)// c
            return new MixedObjectsAndVerb(Mix.InvVsProp, verb, strings[2], strings[1], "");
        else if (is1InPropsRaw && is2InPropsRaw)// d
            return new MixedObjectsAndVerb(Mix.PropVsProp, verb, strings[1], strings[2], "");

        // pure prefixed
        else if (is1InInvsPrefixed && is2InInvsPrefixed)// a
            return new MixedObjectsAndVerb(Mix.InvVsInv, verb, "inv_" + strings[1], "inv_" + strings[2], "");
        else if (is1InInvsPrefixed && is2InPropsPrefixed)// b
            return new MixedObjectsAndVerb(Mix.InvVsProp, verb, "inv_" + strings[1], "prop_" + strings[2], "");
        else if (is2InInvsPrefixed && is1InPropsPrefixed)// c
            return new MixedObjectsAndVerb(Mix.InvVsProp, verb, "inv_" + strings[2], "prop_" + strings[1], "");
        else if (is1InPropsPrefixed && is2InPropsPrefixed)// d
            return new MixedObjectsAndVerb(Mix.PropVsProp, verb, "prop" + strings[1], "prop_" + strings[2], "");

        // mixed case a
        else if (is1InInvsRaw && is2InInvsPrefixed)// a
            return new MixedObjectsAndVerb(Mix.InvVsInv, verb, strings[1], "inv_" + strings[2], "");
        else if (is1InInvsPrefixed && is2InInvsRaw)// a
            return new MixedObjectsAndVerb(Mix.InvVsInv, verb, "inv_" + strings[1], strings[2], "");

        // mixed case b
        else if (is1InInvsRaw && is2InPropsPrefixed)// b
            return new MixedObjectsAndVerb(Mix.InvVsProp, verb, strings[1], "prop_" + strings[2], "");
        else if (is1InInvsPrefixed && is2InPropsRaw)// b
            return new MixedObjectsAndVerb(Mix.InvVsProp, verb, "inv_" + strings[1], strings[2], "");

        // mixed case c
        else if (is2InInvsRaw && is1InPropsPrefixed)// c
            return new MixedObjectsAndVerb(Mix.InvVsProp, verb, strings[2], "prop_" + strings[1], "");
        else if (is2InInvsPrefixed && is1InPropsRaw)// c
            return new MixedObjectsAndVerb(Mix.InvVsProp, verb, "inv_" + strings[2], strings[1], "");

        // mixed case d
        else if (is1InPropsRaw && is2InPropsPrefixed)// d
            return new MixedObjectsAndVerb(Mix.PropVsProp, verb, strings[1], "prop_" + strings[2], "");
        else if (is1InPropsPrefixed && is2InPropsRaw)// d
            return new MixedObjectsAndVerb(Mix.PropVsProp, verb, "prop" + strings[1], strings[2], "");
        return new MixedObjectsAndVerb(Mix.ErrorUseButNoInvOrProp, "", "", "", "Couldn't recognise '" + strings[1] + "' '" + strings[2] + " as something to use");
    }
    return new MixedObjectsAndVerb(Mix.ErrorVerbNotIdentified, "", "", "", "Couldn't recognise '" + strings[1] + " as a verb");
}

