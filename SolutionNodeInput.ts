import {SolutionNode} from './SolutionNode';
import { assert } from 'console';

export class SolutionNodeInput {
    constructor(inputName: string, inputNode: SolutionNode | null = null) {
        assert(inputName && "we cannot allow inputName to be undefined");
        this.inputName = inputName;
        this.inputNode = inputNode;
    }

    CreateClone(uncompleted: Set<SolutionNode>) {
        return new SolutionNodeInput(this.inputName, this.inputNode ? this.inputNode.CreateClone(uncompleted) : null);
    }

    SetInputNode(node: SolutionNode, parent :SolutionNode) {
        this.inputNode = node;
        node.SetParent(parent);
    }

    GetInputNode(): SolutionNode | null {
        return this.inputNode;
    }
    // it is important for input node to be private - because whenever it is set, we should
    // also set the parent
    inputName: string;
    private inputNode: SolutionNode | null;
};