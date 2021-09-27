import promptSync from 'prompt-sync'; //const prompt = require('prompt-sync')({ sigint: true });
import { SolutionNode } from "./SolutionNode";
import { SceneInterfaceFindUsed } from './SceneInterfaceFindUsed';
const prompt = promptSync();

export class ChooseToFindUnused {
    public DoStuff(scene: SceneInterfaceFindUsed): void {
        const invs = scene.GetArrayOfInvs();
        const props = scene.GetArrayOfProps();
        const it = scene.GenerateSolutionNodesMappedByInput().GetValues();

        while (true) {
            const c = it.next();
            if (c.done)
                break;
            const blah = c.value;
            blah.forEach((node: SolutionNode) => {
                // In order to process the output with all the inputs
                // we put it in the list of inputs, and simple process the inputs.
                node.inputHints.push(node.output);
                node.inputs.push(null);
                for (let inputName of node.inputHints) {

                    const invIndex = invs.indexOf(inputName);
                    if (invIndex >= 0)
                        invs.splice(invIndex, 1);
                    const propIndex = props.indexOf(inputName);
                    if (propIndex > 0)
                        props.splice(propIndex, 1);
                };
            });
        }

        console.log("Unused props:");
        props.forEach((name: string) => {
            console.log(name);
        });

        console.log("Unused invs:");
        invs.forEach((name: string) => {
            console.log(name);
        });
    }
}