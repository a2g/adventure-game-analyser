import { SolutionNodeMap } from './SolutionNodeMap';

export interface ScenarioInterfaceFindUnused {
    GetArrayOfProps(): Array<string>;
    GetArrayOfInvs(): Array<string>;
    GetSolutionNodesMappedByInput(): SolutionNodeMap;
}