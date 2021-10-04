import promptSync from 'prompt-sync'; //const prompt = require('prompt-sync')({ sigint: true });
import { SolutionNode } from "./SolutionNode";
import { ReadOnlyJsonInterfaceFindUsed } from './ReadOnlyJsonInterfaceFindUsed';
const prompt = promptSync();

export class ChooseToFindUnused {
    public DoStuff(json: ReadOnlyJsonInterfaceFindUsed): void {
        const invs = json.GetArrayOfInvs();
        const props = json.GetArrayOfProps();
        const it = json.GenerateSolutionNodesMappedByInput().GetValues();

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