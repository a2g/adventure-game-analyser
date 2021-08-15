import { MixedObjectsAndVerb } from "./MixedObjectsAndVerb";
import { SolutionNodeMap } from "./SolutionNodeMap";
import { Happenings } from "./Happenings";

export interface ScenarioInterfacePlayThru {
    GetMixedObjectsAndVerbFromThreeStrings(strings: string[]): MixedObjectsAndVerb;
    GetSolutionNodesMappedByInput(): SolutionNodeMap; 
    GetArrayOfPropVisibilities(): Array<boolean>; 
    GetArrayOfProps(): Array<string>;
    GetArrayOfInvs(): Array<string>;
    GetArrayOfRegs(): Array<string>; 
    GetArrayOfSingleObjectVerbs(): Array<string>;
    GetArrayOInvVisibilities(): Array<boolean>;
    GetArrayOPropVisibilities(): Array<boolean>;
    GetArrayOfVisibilitiesOfSingleObjectVerbs(): Array<boolean>;
    GetArrayOfRegStartingValues(): Array<boolean>;
    GetHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null;
}