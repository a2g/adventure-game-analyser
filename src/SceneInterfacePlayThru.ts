import { MixedObjectsAndVerb } from "./MixedObjectsAndVerb";
import { SolutionNodeMap } from "./SolutionNodeMap";
import { Happenings } from "./Happenings";

export interface SceneInterfacePlayThru {

    GetArrayOfProps(): Array<string>;
    GetArrayOfInvs(): Array<string>;
    GetArrayOfFlags(): Array<string>; 
    GetArrayOfSingleObjectVerbs(): Array<string>;

    GetArrayOfInitialStatesOfInvs(): Array<boolean>;
    GetArrayOfInitialStatesOfProps(): Array<boolean>;
    GetArrayOfInitialStatesOfFlags(): Array<number>;
    GetArrayOfInitialStatesOfSingleObjectVerbs(): Array<boolean>;

    GetSolutionNodesMappedByInput(): SolutionNodeMap; 
    GetHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null;
}