import { ScenarioInterfaceFindLeaves } from './ScenarioInterfaceFindLeaves';
import { ScenarioInterfaceConcoct } from './ScenarioInterfaceConcoct';
import { ScenarioInterfaceFindUnused } from './ScenarioInterfaceFindUnused';
import { ScenarioInterfacePlayThru } from './ScenarioInterfacePlayThru';

export interface ScenarioInterface
    extends ScenarioInterfacePlayThru, ScenarioInterfaceConcoct, ScenarioInterfaceFindLeaves, ScenarioInterfaceFindUnused, ScenarioInterfacePlayThru {

}