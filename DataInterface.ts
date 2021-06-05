import { SolutionNodeMap } from './SolutionNodeMap';
import { SolutionNode } from './SolutionNode';
import { assert } from 'console';
import data from '../20210415JsonPrivate/data/Data.json';
import objects from '../20210415JsonPrivate/data/schema/objects/Objects.json'
import _ from '../20210415JsonPrivate/data/schema/InstructionSet.json';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb';
import { Happenings } from './Happenings';
import { Happening } from './Happening';
import { Happen } from './Happen';
import { Mix } from './Mix';

function Stringify(name: string | undefined): string {
    return name ? name : "";
}
export interface DataInterface {
    GetMixedObjectsAndVerbFromThreeStrings(strings: string[]): MixedObjectsAndVerb;
    GetHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null;
    GetArrayOfSingleObjectVerbs(): Array<string>;
    GetArrayOfVisibilitiesOfSingleObjectVerbs(): Array<boolean>;
    GetArrayOfProps(): Array<string>;
    GetArrayOfInvs(): Array<string>;
    GetArrayOfRegs(): Array<string>;
    GetArrayOfPropVisibilities(): Array<boolean>;
    GetArrayOfInvVisibilities(): Array<boolean>;
    GetSolutionNodeMap(): SolutionNodeMap;
}