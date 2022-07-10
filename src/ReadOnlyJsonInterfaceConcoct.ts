import { SolutionNodeMap } from './SolutionNodeMap';

export interface ReadOnlyJsonInterfaceConcoct {
  GetSetOfStartingProps(): Set<string>;
  GetSetOfStartingInvs(): Set<string>;
  GenerateSolutionNodesMappedByInput(): SolutionNodeMap;
  GetStartingThingsForCharacter(name: string): Set<string>;
  GetArrayOfCharacters(): Array<string>;
  GetStartingThingsInAMap(): Map<string, Set<string>>;
}
