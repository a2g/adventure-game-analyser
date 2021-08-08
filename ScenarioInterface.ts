import { SolutionNodeMap } from './SolutionNodeMap';
import _ from './20210415JsonPrivate/scenario/schema/Script/Script.json';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb';
import { Happenings } from './Happenings';

export interface ScenarioInterface {
    GetMixedObjectsAndVerbFromThreeStrings(strings: string[]): MixedObjectsAndVerb;
    GetHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null;
    GetArrayOfSingleObjectVerbs(): Array<string>;
    GetArrayOfVisibilitiesOfSingleObjectVerbs(): Array<boolean>;
    GetArrayOfProps(): Array<string>;
    GetArrayOfInvs(): Array<string>;
    GetArrayOfRegs(): Array<string>;
    GetSetOfStartingProps(): Set<string>;
    GetArrayOfStartingInvs(): Set<string>;
    GetSolutionNodesMappedByInput(): SolutionNodeMap;
}