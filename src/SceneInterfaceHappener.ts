import { SolutionNodeMap } from './SolutionNodeMap';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb';
import { Happenings } from './Happenings';

export interface SceneInterfaceHappener {
    GetArrayOfProps(): Array<string>;
    GetArrayOfInvs(): Array<string>;
    GetArrayOfFlags(): Array<string>;
    GetArrayOfSingleObjectVerbs(): Array<string>;

    GetArrayOfInitialStatesOfInvs(): Array<boolean>;
    GetArrayOfInitialStatesOfProps(): Array<boolean>;
    GetArrayOfInitialStatesOfSingleObjectVerbs(): Array<boolean>;

    GenerateSolutionNodesMappedByInput(): SolutionNodeMap;
    GetArrayOfInitialStatesOfFlags(): Array<number>;
    FindHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null;
}