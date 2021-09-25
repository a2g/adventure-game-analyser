
import { SolverViaRootNode } from './SolverViaRootNode';
import { SolutionNode } from './SolutionNode';
import { SpecialNodes } from './SpecialNodes';
import { assert } from 'console';
import { SolutionNodeMap } from './SolutionNodeMap';
import { RawObjectsAndVerb } from './RawObjectsAndVerb';
import { Raw } from './Raw';
import _ from './20210415JsonPrivate/Script/Script.json';

export class Solution {
    IsRolloverable(): boolean {
        // rootNode.inputs[0] is "flag_win"
        // rootNode.inputs[0].input[0] is flag_subwin_anthony
        // but since we moved the name in to inputHints, the
        if (this.rootNode) {
            if (this.rootNode.inputs[0]){
                if (this.rootNode.inputs[0].inputHints[0].startsWith("flag_subwin")){
                    return true;
                }
            }
        }
        return false;
    }
    constructor(root: SolutionNode, copyThisMapOfPieces: SolutionNodeMap, startingThingsPassedIn: Set<string>, restrictions: Set<string> | null = null) {
        // initialize non aggregates
        {
            this.solutionName = "uninitialized";
            this.rootNode = root;
            this.nodeMap = new SolutionNodeMap(copyThisMapOfPieces);
        }

        // still tossing up whether to add the root to the incompletes
        // on the against side: what if we are cloning a completed solution?
        // on the for side: vaguely remember that a solution needs to be incomplete when empty
        this.incompleteNodes = new Set<SolutionNode>();
        this.incompleteNodes.add(root);

        // its its passed in we deep copy it
        this.characterRestrictions = new Set<string>();
        if (restrictions) {
            for (let restriction of restrictions) {
                this.characterRestrictions.add(restriction);
            }
        }

        // its its passed in we deep copy it
        this.startingThings = new Set<string>();
        for (let item of startingThingsPassedIn) {
            this.startingThings.add(item);
        }

        // interestingly, leaf nodes don't get cloned 
        // but it doesn't matter that much because they are just used to 
        this.leafNodes = new Map<string, SolutionNode>();
    }

    Clone(): Solution {
        // the weird order of this is because Solution constructor is used 
        // primarily to construct, so passing in root node is needed..
        // so we clone the whole tree and pass it in
        const incompleteNodes = new Set<SolutionNode>();
        const clonedRootNode = this.rootNode.CloneNodeAndEntireTree(incompleteNodes);
        clonedRootNode.id = this.rootNode.id;//not sure why do this, but looks crucial!
        const clonedSolution = new Solution(clonedRootNode, this.nodeMap, this.startingThings, this.characterRestrictions);
        clonedSolution.SetIncompleteNodes(incompleteNodes);
        return clonedSolution;
    }

    SetNodeIncomplete(node: SolutionNode | null): void {
        if (node)
            if (node.type !== SpecialNodes.VerifiedLeaf)
                this.incompleteNodes.add(node);
    }

    MarkNodeAsCompleted(node: SolutionNode | null): void {
        if (node) {
            if (this.incompleteNodes.has(node)) {
                this.incompleteNodes.delete(node);
            }
        }
    }

    SetNodeCompleteGenuine(node: SolutionNode | null): void {
        if (node) {
            if (this.incompleteNodes.has(node)) {
                this.incompleteNodes.delete(node);
            }
        }
    }


    SetIncompleteNodes(set: Set<SolutionNode>) {
        // safer to copy this - just being cautious
        this.incompleteNodes = new Set<SolutionNode>();
        for (let node of set) {
            this.incompleteNodes.add(node);
        }
    }

    IsNodesRemaining(): boolean {
        return this.incompleteNodes.size > 0;
    }

    AddVerifiedLeaf(path: string, node: SolutionNode): void {
        assert(node.output);
        this.leafNodes.set(path, node);
    }

    ProcessUntilCloning(solutions: SolverViaRootNode): boolean {
        const isBreakingDueToSolutionCloning = this.rootNode.ProcessUntilCloning(this, solutions, "/");
        if (!isBreakingDueToSolutionCloning) {
            // then this means the root node has rolled to completion
            this.incompleteNodes.clear();
        }
        return isBreakingDueToSolutionCloning;
    }

    GetLeafNodes(): ReadonlyMap<string, SolutionNode> {
        return this.leafNodes;
    }

    GetIncompleteNodes(): Set<SolutionNode> {
        return this.incompleteNodes;
    }

    GetRootNode(): SolutionNode {
        return this.rootNode;
    }

    HasAnyNodesThatOutputObject(objectToObtain: string): boolean {
        return this.nodeMap.Has(objectToObtain);
    }

    GetNodesThatOutputObject(objectToObtain: string): SolutionNode[] | undefined {

        let result = this.nodeMap.Get(objectToObtain);

        if (result) {
            let blah = new Array<SolutionNode>();
            for (let item of result) {
                if (item.count >= 1) {
                    blah.push(item);
                }
            }
            return blah;
        }
        return result;
    }

    RemoveNode(node: SolutionNode) {
        this.nodeMap.RemoveNode(node);
    }

    SetName(solutionName: string) {
        this.solutionName = solutionName;
    }

    GetName(): string {
        return this.solutionName;
    }

    GeneratePath(node: SolutionNode | null) {
        let path = "";
        while (node) {
            path = node.output + "/" + path;
            node = node.GetParent();
        }
        return "/" + path;
    }

    GetNextDoableCommandAndDesconstructTree(): RawObjectsAndVerb | null {
        for (const input of this.leafNodes) {
            const key: string = input[0];
            const node: SolutionNode = input[1];
            let areAllInputsAvailable = true;

            // inputs are nearly always 2, but in one case they can be 6.. using for(;;) isn't such a useful optimizaiton here             // for (let i = 0; i < node.inputs.length; i++) {
            for (let name of node.inputHints) {
                if (!this.startingThings.has(name))
                    areAllInputsAvailable = false;
            };

            if (areAllInputsAvailable) {
                // first we give them the output            
                if (node.type !== SpecialNodes.VerifiedLeaf)
                    this.startingThings.add(node.output);
                //.. we don't remove the input, because some node types don't remove
                // and this little algorithm doesn't know how yet

                const pathOfThis = this.GeneratePath(node);
                const pathOfParent = this.GeneratePath(node.parent);

                // then we remove this key as a leaf node..
                this.leafNodes.delete(key);

                // ... and add a parent in its place
                if (node.parent)
                    this.leafNodes.set(pathOfParent, node.parent);

                if (node == this.rootNode) {
                    return new RawObjectsAndVerb(Raw.You_have_won_the_game, "", "", node.getRestrictions(), node.type);
                } else if (node.inputs.length === 0) {
                    return new RawObjectsAndVerb(Raw.None, "", "", node.getRestrictions(), node.type);
                } else if (node.type.toLowerCase().includes("grab")) {
                    return new RawObjectsAndVerb(Raw.Grab, node.inputHints[0], "", node.getRestrictions(), node.type);
                } else if (node.type.toLowerCase().includes("toggle")) {
                    return new RawObjectsAndVerb(Raw.Toggle, node.inputHints[0], node.output, node.getRestrictions(), node.type);
                } else if (node.type.toLowerCase().includes("auto")) {
                    let text = "auto using (";
                    for (let inputName of node.inputHints) {
                        text += inputName + " ";
                    };
                    return new RawObjectsAndVerb(Raw.Auto, node.inputHints[0], node.output, node.getRestrictions(), node.type);
                } else if (node.type.toLowerCase().includes("use")) {// then its nearly definitely "use", unless I messed up
                    return new RawObjectsAndVerb(Raw.Use, node.inputHints[0], node.inputHints[1], node.getRestrictions(), node.type);
                } else if (node.inputs.length === 2) { // smoking gun, if something is mislabelled "Use" 
                    return new RawObjectsAndVerb(Raw.Use, node.inputHints[0], node.inputHints[1], node.getRestrictions(), node.type);
                } else if (node.parent == null) {
                    // I think this means tha the root node isn't set properly!
                    // so we need to set breakpoint on this return, and the one above, and debug
                    return new RawObjectsAndVerb(Raw.You_have_won_the_game, node.inputHints[0], "", node.getRestrictions(), node.type);
                } else {
                    assert(false && " type not identified");
                    console.log("Assertion because of type not Identified!: " + node.type + node.inputs[0]);
                }
            }
        };

        return null;
    }

    addRestrictions(restrictions: Array<string>) {

        for (const restriction of restrictions) {
            this.characterRestrictions.add(restriction);
        }

    }

    getRestrictions(): Set<string> {
        return this.characterRestrictions;
    }

    // non aggregates
    solutionName: string;
    rootNode: SolutionNode;
    nodeMap: SolutionNodeMap;

    // aggregates
    incompleteNodes: Set<SolutionNode>;
    leafNodes: Map<string, SolutionNode>;
    readonly characterRestrictions: Set<string>;
    readonly startingThings: Set<string>;

}