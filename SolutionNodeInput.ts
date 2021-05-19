import {SolutionNode} from './SolutionNode';
import { assert } from 'console';

export class SolutionNodeInput {
    constructor(inputName: string, inputNode: SolutionNode | null = null) {
        assert(inputName && "we cannot allow inputName to be undefined");
        this.inputName = inputName;
        this.inputNode = inputNode;
    }

    CreateClone(uncompleted: Set<SolutionNode>) {
        return new SolutionNodeInput(this.inputName, this.inputNode? this.inputNode.CreateClone(uncompleted) : null);
    }
    inputName: string;
    inputNode: SolutionNode|null;
};