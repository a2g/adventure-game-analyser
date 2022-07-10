import { SolverViaRootNode } from './SolverViaRootNode';
import { SolutionNode } from './SolutionNode';
import { SpecialNodes } from './SpecialNodes';
import { SolutionNodeMap } from './SolutionNodeMap';
import { RawObjectsAndVerb } from './RawObjectsAndVerb';
import { Raw } from './Raw';
import _ from './20210415JsonPrivate/Gate/Gate.json';
import { isNullOrUndefined } from 'util';
import * as fs from "fs";
import { ReadOnlyJsonSingle } from './ReadOnlyJsonSingle';
import { GetDisplayName } from './GetDisplayName';

export class Solution {

  // non aggregates
  private solutionNames: Array<string>;
  rootNodes: Array<SolutionNode>;
  remainingNodes: SolutionNodeMap;
  isArchived: boolean;
  bags: Array<[string, string]>;

  // aggregates
  unprocessedNodes: Set<SolutionNode>;
  leafNodes: Map<string, SolutionNode>;
  mapOfVisibleThings: Map<string, Set<string>>;// this is updated dynamically in GetNextDoableCommandAndDesconstructTree
  readonly restrictionsEncounteredDuringSolving: Set<string>;

  constructor(
    rootNodes: Array<SolutionNode>,
    remainingNodes: SolutionNodeMap,
    startingThingsPassedIn: Map<string, Set<string>>,
    bags: Array<[string, string]> | null = null,
    restrictions: Set<string> | null = null,
    nameSegments: Array<string> | null = null) {

    // initialize non aggregates
    {
      this.rootNodes = rootNodes;
      this.remainingNodes = new SolutionNodeMap(remainingNodes);
      this.isArchived = false;
      this.bags = new Array<[string, string]>();
    }

    // still tossing up whether to add the root to the incompletes
    // on the against side: what if we are cloning a completed solution?
    // on the for side: vaguely remember that a solution needs to be incomplete when empty
    this.unprocessedNodes = new Set<SolutionNode>();
    for (let node of this.rootNodes) {
      this.unprocessedNodes.add(node);//when this became an array, I just added it, I'm not sure if its a good thing
    }

    // its its passed in we deep copy it
    this.mapOfVisibleThings = new Map<string, Set<string>>();
    startingThingsPassedIn.forEach((value: Set<string>, key: string) => {
      let newSet = new Set<string>();
      for (let item of value) {
        newSet.add(item);
      }
      this.mapOfVisibleThings.set(key, newSet);
    });

    // if bags is passed in we shallow copy it
    // (this string couplets will remained coupled during this program)
    if (bags) {
      for (const entry of bags) {
        this.bags.push(entry);
      }
    }

    // its its passed in we deep copy it
    this.restrictionsEncounteredDuringSolving = new Set<string>();
    if (restrictions) {
      for (let restriction of restrictions) {
        this.restrictionsEncounteredDuringSolving.add(restriction);
      }
    }

    // if it is passed in, we deep copy it
    this.solutionNames = new Array<string>();
    if (nameSegments) {
      for (let segment of nameSegments)
        this.solutionNames.push(segment);
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
    let clonedRootNodes = new Array<SolutionNode>();
    for (let node of this.rootNodes) {
      const clonedRootNode = node.CloneNodeAndEntireTree(incompleteNodes);
      clonedRootNode.id = node.id;//not sure why do this, but looks crucial!
      clonedRootNodes.push(clonedRootNode);
    }

    const clonedSolution = new Solution(clonedRootNodes, this.remainingNodes, this.mapOfVisibleThings, this.bags, this.restrictionsEncounteredDuringSolving, this.solutionNames);
    clonedSolution.SetIncompleteNodes(incompleteNodes);
    return clonedSolution;
  }

  SetNodeIncomplete(node: SolutionNode | null): void {
    if (node)
      if (node.type !== SpecialNodes.VerifiedLeaf)
        this.unprocessedNodes.add(node);
  }

  MarkNodeAsCompleted(node: SolutionNode | null): void {
    if (node) {
      if (this.unprocessedNodes.has(node)) {
        this.unprocessedNodes.delete(node);
      }
    }
  }

  SetNodeCompleteGenuine(node: SolutionNode | null): void {
    if (node) {
      if (this.unprocessedNodes.has(node)) {
        this.unprocessedNodes.delete(node);
      }
    }
  }


  SetIncompleteNodes(set: Set<SolutionNode>) {
    // safer to copy this - just being cautious
    this.unprocessedNodes = new Set<SolutionNode>();
    for (let node of set) {
      this.unprocessedNodes.add(node);
    }
  }

  IsAnyNodesUnprocessed(): boolean {
    return this.unprocessedNodes.size > 0;
  }

  AddVerifiedLeaf(path: string, node: SolutionNode): void {
    this.leafNodes.set(path, node);
  }

  ProcessUntilCloning(solutions: SolverViaRootNode): boolean {

    for (let node of this.rootNodes) {
      const isBreakingDueToSolutionCloning = node.ProcessUntilCloning(this, solutions, "/");
      if (!isBreakingDueToSolutionCloning) {
        // then this means the root node has rolled to completion
        this.unprocessedNodes.clear();
      }
      return isBreakingDueToSolutionCloning;
    }
    return false;
  }

  GetLeafNodes(): ReadonlyMap<string, SolutionNode> {
    return this.leafNodes;
  }

  GetUnprocessedNodes(): Set<SolutionNode> {
    return this.unprocessedNodes;
  }

  GetMainRootNode(): SolutionNode {
    return this.rootNodes[0];
  }

  HasAnyNodesThatOutputObject(objectToObtain: string): boolean {
    return this.remainingNodes.Has(objectToObtain);
  }

  GetNodesThatOutputObject(objectToObtain: string): SolutionNode[] | undefined {
    let result = this.remainingNodes.Get(objectToObtain);
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
    this.remainingNodes.RemoveNode(node);
  }

  PushNameSegment(solutionName: string) {
    this.solutionNames.push(solutionName);
  }

  GetDisplayNamesConcatenated(): string {
    let result = "";
    for (let i = 0; i < this.solutionNames.length; i++) {
      let symbol = i == 0 ? "" : "/";
      result += symbol + GetDisplayName(this.solutionNames[i]);
    }
    return result;
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
        if (!this.mapOfVisibleThings.has(name))
          areAllInputsAvailable = false;
      };

      if (areAllInputsAvailable) {
        // first we give them the output
        if (node.type !== SpecialNodes.VerifiedLeaf)
          this.AddToMapOfVisibleThings(node.output);
        //.. we don't remove the input, because some node types don't remove
        // and this little algorithm doesn't know how yet

        const pathOfThis = this.GeneratePath(node);
        const pathOfParent = this.GeneratePath(node.parent);

        // then we remove this key as a leaf node..
        this.leafNodes.delete(key);

        // ... and add a parent in its place
        if (node.parent)
          this.leafNodes.set(pathOfParent, node.parent);

        if (node == this.rootNodes[0]) {
          return new RawObjectsAndVerb(Raw.You_have_won_the_game, "", "", node.getRestrictions(), node.type);
        } else if (node.inputs.length === 0) {
          return new RawObjectsAndVerb(Raw.None, "", "", node.getRestrictions(), node.type);
        } else if (node.type.toLowerCase().includes("grab")) {
          return new RawObjectsAndVerb(Raw.Grab, node.inputHints[0], "", node.getRestrictions(), node.type);
        } else if (node.type.toLowerCase().includes("talk")) {
          return new RawObjectsAndVerb(Raw.Talk, node.inputHints[0], "", node.getRestrictions(), node.type);
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
        } else if (node.inputs.length === 2) { // if they mis-type the verb, then we default to use
          return new RawObjectsAndVerb(Raw.Use, node.inputHints[0], node.inputHints[1], node.getRestrictions(), node.type);
        } else if (node.parent == null) {
          // I think this means tha the root node isn't set properly!
          // so we need to set breakpoint on this return, and the one above, and debug
          return new RawObjectsAndVerb(Raw.You_have_won_the_game, node.inputHints[0], "", node.getRestrictions(), node.type);
        } else {
          //assert(false && " type not identified");
          console.log("Assertion because of type not Identified!: " + node.type + node.inputs[0] + (node.inputs.length > 1 ? node.inputs[0] : ""));
        }
      }
    };

    return null;
  }

  AddRestrictions(restrictions: Array<string>) {
    for (const restriction of restrictions) {
      this.restrictionsEncounteredDuringSolving.add(restriction);
    }
  }

  GetAccumulatedRestrictions(): Set<string> {
    return this.restrictionsEncounteredDuringSolving;
  }



  UpdateMapOfVisibleThingsWithAReverseTraversal() {
    const array = new Array<SolutionNode>();

    // we do this width first recursively to get order from root to leaves
    this.CollectArrayOfNodesInAWidthFirstRecursively(this.rootNodes[0], array);

    // then we traverse the array backwards - from oldest to newest
    for (let i = array.length - 1; i >= 0; i--) {
      array[i].UpdateMapWithOutcomes(this.mapOfVisibleThings);
    }
  }

  GetMapOfCurrentlyRemainingNodes(): SolutionNodeMap {
    // we already remove nodes from this when we use them up
    // so returning the current node map is ok
    return this.remainingNodes;
  }

  private CollectArrayOfNodesInAWidthFirstRecursively(n: SolutionNode, array: Array<SolutionNode | null>) {
    for (let input of n.inputs) {
      array.push(input);
    }

    for (let input of n.inputs) {
      if (!isNullOrUndefined(input)) {
        this.CollectArrayOfNodesInAWidthFirstRecursively(input, array);
      }
    }
  }

  private AddToMapOfVisibleThings(thing: string) {
    if (!this.mapOfVisibleThings.has(thing)) {
      this.mapOfVisibleThings.set(thing, new Set<string>());
    }
  }

  MergeInNodesForSecondaryGoalCompletion(chapterFlag: string) {
    let autos = this.remainingNodes.GetAutos();
    for (const node of autos) {
      // find the auto that imports json
      if (node.inputHints[0] === chapterFlag) {
        if (node.type == _.AUTO_FLAG1_CAUSES_IMPORT_OF_JSON) {
          if (fs.existsSync(node.output)) {
            let json = new ReadOnlyJsonSingle(node.output);
            this.remainingNodes.MergeInNodesFromScene(json);
          }
          continue;
        }
      }
    }
  }

  GetMapOfVisibleThings(): Map<string, Set<string>> {
    return this.mapOfVisibleThings;
  }

  SetAsArchived() {
    this.isArchived = true;
  }

  IsArchived() {
    return this.isArchived;
  }

  GetLastDisplayNameSegment() {
    return this.solutionNames[this.solutionNames.length - 1];
  }

  CopyNameToVirginSolution(virginSolution: Solution) {
    for (let nameSegment of this.solutionNames) {
      virginSolution.PushNameSegment(nameSegment);
    }
  }
}
