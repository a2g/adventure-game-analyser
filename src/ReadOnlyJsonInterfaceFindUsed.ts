import { SolutionNodeMap } from './SolutionNodeMap';

export interface ReadOnlyJsonInterfaceFindUsed {
    GetArrayOfProps(): Array<string>;
    GetArrayOfInvs(): Array<string>;
    GenerateSolutionNodesMappedByInput(): SolutionNodeMap;
}
