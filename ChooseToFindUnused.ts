import promptSync from 'prompt-sync'; //const prompt = require('prompt-sync')({ sigint: true });
import { Scenario } from "./Scenario";
import { Solution } from "./Solution";
import { SolutionCollection } from "./SolutionCollection";
import { SolutionNode } from "./SolutionNode"; 
import { SolutionNodeInput } from './SolutionNodeInput';
const prompt = promptSync();

 

export class ChooseToFindUnused {
    public DoStuff(): void {

        const invs = Scenario.GetArrayOfInvs();
        const props = Scenario.GetArrayOfProps();
        const it = Scenario.GetSolutionNodeMap().GetValues();
        while(true){
            const c = it.next();
            if (c.done)
                break;
            const blah = c.value;
            blah.forEach((node: SolutionNode) => {
                // In order to process the output with all the inputs
                // we put it in the list of inputs, and simple process the inputs.
                node.inputs.push(new SolutionNodeInput(node.output, null));
                node.inputs.forEach((input: SolutionNodeInput) => {

                    const invIndex = invs.indexOf(input.inputName);
                    if (invIndex >= 0)
                        invs.splice(invIndex, 1);
                    const propIndex = props.indexOf(input.inputName);
                    if (propIndex > 0)
                        props.splice(propIndex, 1);
                });
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