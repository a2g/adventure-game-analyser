import { SolutionNodeMap } from './SolutionNodeMap';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb';
import { Happenings } from './Happenings';

export interface ScenarioInterfaceHappener {
    GetArrayOfProps(): Array<string>;
    GetArrayOfInvs(): Array<string>;
    GetArrayOfRegs(): Array<string>;
    GetSolutionNodesMappedByInput(): SolutionNodeMap;
    GetArrayOfSingleObjectVerbs(): Array<string>;
    GetArrayOInvVisibilities(): Array<boolean>;
    GetArrayOPropVisibilities(): Array<boolean>;
    GetArrayOfVisibilitiesOfSingleObjectVerbs(): Array<boolean>;
    GetArrayOfRegStartingValues(): Array<boolean>;
    GetHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null;
}