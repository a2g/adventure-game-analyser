import { SolutionNodeMap } from './SolutionNodeMap';

export interface ReadOnlyJsonInterfaceFindLeaves {
    GenerateSolutionNodesMappedByInput(): SolutionNodeMap;
    GetMapOfAllStartingThings(): Map<string, Set<string>>;
}
