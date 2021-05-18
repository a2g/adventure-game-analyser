import {SolutionNode} from './SolutionNode';

export class SolutionNodeInput {
    constructor(inputName: string, inputNode: SolutionNode|null = null) {
        this.inputName = inputName;
        this.inputNode = inputNode;
    }

    CreateClone(uncompleted: Set<SolutionNode>) {
        return new SolutionNodeInput(this.inputName, this.inputNode? this.inputNode.CreateClone(uncompleted) : null);
    }
    inputName: string;
    inputNode: SolutionNode|null;
};