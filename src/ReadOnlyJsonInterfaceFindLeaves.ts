import { SolutionNodeMap } from './SolutionNodeMap';

export interface ReadOnlyJsonInterfaceFindLeaves {
  GenerateSolutionNodesMappedByInput(): SolutionNodeMap;
  GetStartingThingsInAMap(): Map<string, Set<string>>;
}
