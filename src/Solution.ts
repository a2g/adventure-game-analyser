
import { SolutionCollection } from './SolutionCollection';
import { SolutionNode } from './SolutionNode';
import { SpecialNodes } from './SpecialNodes';
import { assert } from 'console';
import { SolutionNodeMap } from './SolutionNodeMap';
import { SolutionNodeInput } from './SolutionNodeInput';
import { RawObjectsAndVerb } from './RawObjectsAndVerb';
import { Raw  } from './Raw';
import { isNullOrUndefined } from 'util';

export class Solution {

    constructor(root: SolutionNode, map: SolutionNodeMap) {
        this.solutionName = "uninitialized";
        this.rootNode = root;
        this.incompleteNodes = new Set<SolutionNode>();
        this.incompleteNodes.add(root);
        this.absoluteLeafNodes = new Map<string, SolutionNode>();
        this.usedVerbNounCombos = new Set<string>();
        this.transactionMap = new SolutionNodeMap(map);
        this.characterRestrictions = new Set<string>();
    }

    AddVerbNounCombo(verb: string, noun: string): void {
        this.usedVerbNounCombos.add(verb + noun);
    }
    HasAlreadyUsedVerbNounCombo(verb: string, noun: string): boolean {
        const isIncluded = this.usedVerbNounCombos.has(verb + noun);
        return isIncluded;
    }

    SetNodeIncomplete(node: SolutionNode | null): void {
        if (node)
            if (node.type !==SpecialNodes.VerifiedLeaf)
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

    Clone(): Solution {
        const clonedRootNode = new SolutionNode(this.rootNode.output);
        clonedRootNode.id = this.rootNode.id;
        const clonedSolution = new Solution(clonedRootNode, this.transactionMap);
        let isAnyIncomplete = false;
        for (const node of this.rootNode.inputs) {
            const clonedNode = node.CreateClone(clonedSolution.incompleteNodes);
            clonedSolution.rootNode.inputs.push(clonedNode);
            if (clonedNode.GetInputNode() === null)
                isAnyIncomplete = true;
        }

        if (isAnyIncomplete)
            clonedSolution.incompleteNodes.add(clonedRootNode);
        this.usedVerbNounCombos.forEach((combo: string) => {
            clonedSolution.AddVerbNounCombo(combo,"");
        });
        return clonedSolution;
    }

    IsNodesRemaining(): boolean {
        return this.incompleteNodes.size > 0;
    }

    AddVerifiedLeaf(path: string, node: SolutionNode): void {
        assert(node.output);
        this.absoluteLeafNodes.set(path, node);
    }

    ProcessUntilCloning( solutions: SolutionCollection): boolean {
        const isBreakingDueToSolutionCloning = this.rootNode.ProcessUntilCloning(this, solutions,"/");
        if (!isBreakingDueToSolutionCloning) {
            // then this means the root node has rolled to completion
            this.incompleteNodes.clear();
        }
        return isBreakingDueToSolutionCloning;
    }
       
    GetLeafNodes(): Map<string, SolutionNode> {
        return this.absoluteLeafNodes;
    }

    GetIncompleteNodes(): Set<SolutionNode> {
        return this.incompleteNodes;
    }

    GetRootNode(): SolutionNode {
        return this.rootNode;
    }

    HasAnyTransactionsThatOutputObject(objectToObtain: string): boolean{
        return this.transactionMap.Has(objectToObtain);
    }

    GetNodesThatOutputObject(objectToObtain: string): SolutionNode[] |undefined{
        
        let result = this.transactionMap.Get(objectToObtain);

        if (result) {
            let blah = new Array<SolutionNode>();
            for (let item of result) {
                if(item.count>=1){
                    blah.push(item);
                }
            }
            return blah;
        }
        return result;
    }

    RemoveNode(transaction: SolutionNode) {
        this.transactionMap.RemoveTransaction(transaction);
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
            path =  node.output + "/" + path;
            node = node.GetParent();
        }
        return "/" + path;
    }

    GetNextDoableCommandAndDesconstructTree(setToUse: Set<string>): RawObjectsAndVerb | null {
        for (const input of this.absoluteLeafNodes) {
            const key: string = input[0];
            const node: SolutionNode = input[1];
            let areAllInputsAvailable = true;

            // inputs are nearly always 2, but in one case they can be 6.. using for(;;) isn't such a useful optimizaiton here             // for (let i = 0; i < node.inputs.length; i++) {
            node.inputs.forEach((input: SolutionNodeInput) => {
                if (!setToUse.has(input.inputName)) 
                    areAllInputsAvailable = false;
            });

            if (areAllInputsAvailable) {
                // first we give them the prize            
                if (node.type !== SpecialNodes.VerifiedLeaf)
                    setToUse.add(node.output);

                const pathOfThis = this.GeneratePath(node);
                const pathOfParent = this.GeneratePath(node.parent);

                // then we remove this key as a leaf node..
                this.absoluteLeafNodes.delete(key);

                // ... and add a parent in its place
                if (node.parent)
                    this.absoluteLeafNodes.set(pathOfParent, node.parent);

                if (node == this.rootNode) {
                    return new RawObjectsAndVerb(Raw.You_have_won_the_game, "", "", node.getRestrictions());
                } else if (node.inputs.length === 0) {
                    return new RawObjectsAndVerb(Raw.None, "", "", node.getRestrictions());
                } else if (node.type.toLowerCase().includes("grab")) {
                    return new RawObjectsAndVerb(Raw.Grab, node.inputs[0].inputName, "", node.getRestrictions());
                } else if (node.type.toLowerCase().includes("toggle")) {
                    return new RawObjectsAndVerb(Raw.Toggle, node.inputs[0].inputName, node.output, node.getRestrictions());
                } else if (node.type.toLowerCase().includes("auto")) {
                    let text = "auto using (";
                    node.inputs.forEach((node: SolutionNodeInput) => {
                        text += node.inputName + " ";
                    });
                    return new RawObjectsAndVerb(Raw.Auto, node.inputs[0].inputName, node.output, node.getRestrictions()); 
                } else if (node.inputs.length === 2) {
                    return new RawObjectsAndVerb(Raw.Use, node.inputs[0].inputName, node.output, node.getRestrictions());
                } else if (node.type.toLowerCase().includes("use")){
                    return new RawObjectsAndVerb(Raw.Use, node.inputs[0].inputName, node.inputs[1].inputName, node.getRestrictions());
                }else {
                    assert(false && " type not identified");
                    console.log("Assertion because of type not Identified!: "+node.type +node.inputs[0] );
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

    getRestrictions(): Set<string>{
        return this.characterRestrictions;
    }

    rootNode: SolutionNode;
    solutionName: string;
    incompleteNodes: Set<SolutionNode>;
    absoluteLeafNodes: Map<string, SolutionNode>;
    usedVerbNounCombos: Set<string>;
    transactionMap: SolutionNodeMap;
    characterRestrictions: Set<string>;
}