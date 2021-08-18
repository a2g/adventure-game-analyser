import { SolutionNodeMap } from './SolutionNodeMap';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb';
import { Happenings } from './Happenings';

export interface ScenarioInterfaceHappener {
    GetArrayOfProps(): Array<string>;
    GetArrayOfInvs(): Array<string>;
    GetArrayOfFlags(): Array<string>;
    GetArrayOfSingleObjectVerbs(): Array<string>;
  
    GetArrayOfInitialStatesOfInvs(): Array<boolean>;
    GetArrayOfInitialStatesOfProps(): Array<boolean>;
    GetArrayOfInitialStatesOfSingleObjectVerbs(): Array<boolean>;

    GetSolutionNodesMappedByInput(): SolutionNodeMap;
    GetArrayOfInitialStatesOfFlags(): Array<boolean>;
    GetHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null;
}