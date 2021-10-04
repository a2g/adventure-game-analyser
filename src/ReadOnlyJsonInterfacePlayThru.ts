import { MixedObjectsAndVerb } from "./MixedObjectsAndVerb";
import { SolutionNodeMap } from "./SolutionNodeMap";
import { Happenings } from "./Happenings";

export interface ReadOnlyJsonInterfacePlayThru {

    GetArrayOfProps(): Array<string>;
    GetArrayOfInvs(): Array<string>;
    GetArrayOfFlags(): Array<string>;
    GetArrayOfSingleObjectVerbs(): Array<string>;

    GetArrayOfInitialStatesOfInvs(): Array<boolean>;
    GetArrayOfInitialStatesOfProps(): Array<boolean>;
    GetArrayOfInitialStatesOfFlags(): Array<number>;
    GetArrayOfInitialStatesOfSingleObjectVerbs(): Array<boolean>;

    GenerateSolutionNodesMappedByInput(): SolutionNodeMap;
    FindHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null;
}
