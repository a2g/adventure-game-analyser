import { SolutionNodeMap } from './SolutionNodeMap';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb';
import { Happenings } from './Happenings';

export interface SceneInterfaceCollater {
    AddStartingPropsToGivenSet(givenSet: Set<string>): void;
    AddStartingInvsToGivenSet(givenSet: Set<string>): void;
    AddStartingFlagsToGivenSet(givenSet: Set<string>): void;
    AddStartingThingsToGivenSet(givenSet: Set<[string, string]>): void;
    AddPropsToGivenSet(givenSet: Set<string>): void;
    AddFlagsToGivenSet(givenSet: Set<string>): void;
    AddInvsToGivenSet(givenSet: Set<string>): void;
    AddCharsToGivenSet(givenSet: Set<string>): void;
}