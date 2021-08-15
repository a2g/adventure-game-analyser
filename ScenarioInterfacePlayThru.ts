import { MixedObjectsAndVerb } from "./MixedObjectsAndVerb";
import { SolutionNodeMap } from "./SolutionNodeMap";
import { Happenings } from "./Happenings";

export interface ScenarioInterfacePlayThru {

    GetArrayOfProps(): Array<string>;
    GetArrayOfInvs(): Array<string>;
    GetArrayOfFlags(): Array<string>; 
    GetArrayOfSingleObjectVerbs(): Array<string>;

    GetArrayOfInitialStatesOfInvs(): Array<boolean>;
    GetArrayOfInitialStatesOfProps(): Array<boolean>;
    GetArrayOfInitialStatesOfFlags(): Array<boolean>;
    GetArrayOfInitialStatesOfSingleObjectVerbs(): Array<boolean>;

    GetMixedObjectsAndVerbFromThreeStrings(strings: string[]): MixedObjectsAndVerb;
    GetSolutionNodesMappedByInput(): SolutionNodeMap; 
    GetHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null;
}