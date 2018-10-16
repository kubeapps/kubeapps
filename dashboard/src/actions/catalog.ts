import * as _ from "lodash";
import { ThunkAction } from "redux-thunk";
import { ActionType, createAction } from "typesafe-actions";

import { JSONSchema6 } from "json-schema";
import { IClusterServiceClass } from "../shared/ClusterServiceClass";
import { definedNamespaces } from "../shared/Namespace";
import { IServiceBindingWithSecret, ServiceBinding } from "../shared/ServiceBinding";
import { IServiceBroker, IServicePlan, ServiceCatalog } from "../shared/ServiceCatalog";
import { IServiceInstance, ServiceInstance } from "../shared/ServiceInstance";
import { IStoreState } from "../shared/types";

export const checkCatalogInstall = createAction("CHECK_INSTALL");
export const installed = createAction("INSTALLED");
export const notInstalled = createAction("NOT_INSTALLED");
export const requestBrokers = createAction("REQUEST_BROKERS");
export const receiveBrokers = createAction("RECEIVE_BROKERS", resolve => {
  return (brokers: IServiceBroker[]) => resolve(brokers);
});

export const requestPlans = createAction("REQUEST_PLANS");
export const receivePlans = createAction("RECEIVE_PLANS", resolve => {
  return (plans: IServicePlan[]) => resolve(plans);
});

export const requestInstances = createAction("REQUEST_INSTANCES");
export const receiveInstances = createAction("RECEIVE_INSTANCES", resolve => {
  return (instances: IServiceInstance[]) => resolve(instances);
});

export const requestBindingsWithSecrets = createAction("REQUEST_BINDINGS_WITH_SECRETS");
export const receiveBindingsWithSecrets = createAction("RECEIVE_BINDINGS_WITH_SECRETS", resolve => {
  return (bindingsWithSecrets: IServiceBindingWithSecret[]) => resolve(bindingsWithSecrets);
});

export const requestClasses = createAction("REQUEST_PLANS");
export const receiveClasses = createAction("RECEIVE_CLASSES", resolve => {
  return (classes: IClusterServiceClass[]) => resolve(classes);
});

export const errorCatalog = createAction("ERROR_CATALOG", resolve => {
  return (err: Error, op: "fetch" | "create" | "delete" | "deprovision" | "update") =>
    resolve({ err, op });
});

const actions = [
  checkCatalogInstall,
  installed,
  notInstalled,
  requestBrokers,
  receiveBrokers,
  requestPlans,
  receivePlans,
  requestInstances,
  receiveInstances,
  requestBindingsWithSecrets,
  receiveBindingsWithSecrets,
  requestClasses,
  receiveClasses,
  errorCatalog,
];

export type ServiceCatalogAction = ActionType<typeof actions[number]>;

function isEmptyDeep(obj: any): boolean {
  if (typeof obj === "number") {
    // isEmpty(number) is true but it's not empty
    return false;
  }
  if (typeof obj === "object" && !_.isEmpty(obj)) {
    // Check if nested objects are empty
    // If some of the keys are not empty the result is not empty
    return !Object.keys(obj).some(k => {
      return !isEmptyDeep(obj[k]);
    });
  }
  return _.isEmpty(obj);
}

function removeEmptyFields(obj: object, schema?: JSONSchema6) {
  const res = { ...obj };
  Object.keys(res).forEach(k => {
    // Delete the key if it's empty and it's marked as optional by the schema
    if (isEmptyDeep(res[k]) && schema && schema.required && schema.required.indexOf(k) === -1) {
      delete res[k];
    }
  });
  return res;
}

export function provision(
  releaseName: string,
  namespace: string,
  className: string,
  planName: string,
  parameters: {},
  schema?: JSONSchema6,
): ThunkAction<Promise<boolean>, IStoreState, null, ServiceCatalogAction> {
  return async dispatch => {
    try {
      const filteredParams = removeEmptyFields(parameters, schema);
      await ServiceInstance.create(releaseName, namespace, className, planName, filteredParams);
      return true;
    } catch (e) {
      dispatch(errorCatalog(e, "create"));
      return false;
    }
  };
}

export function addBinding(
  bindingName: string,
  instanceName: string,
  namespace: string,
  parameters: {},
  schema?: JSONSchema6,
): ThunkAction<Promise<boolean>, IStoreState, null, ServiceCatalogAction> {
  return async dispatch => {
    try {
      const filteredParams = removeEmptyFields(parameters, schema);
      await ServiceBinding.create(bindingName, instanceName, namespace, filteredParams);
      return true;
    } catch (e) {
      dispatch(errorCatalog(e, "create"));
      return false;
    }
  };
}

export function removeBinding(
  name: string,
  namespace: string,
): ThunkAction<Promise<boolean>, IStoreState, null, ServiceCatalogAction> {
  return async dispatch => {
    try {
      await ServiceBinding.delete(name, namespace);
      return true;
    } catch (e) {
      dispatch(errorCatalog(e, "delete"));
      return false;
    }
  };
}

export function deprovision(
  instance: IServiceInstance,
): ThunkAction<Promise<boolean>, IStoreState, null, ServiceCatalogAction> {
  return async dispatch => {
    try {
      await ServiceCatalog.deprovisionInstance(instance);
      return true;
    } catch (e) {
      dispatch(errorCatalog(e, "deprovision"));
      return false;
    }
  };
}

export function sync(
  broker: IServiceBroker,
): ThunkAction<Promise<void>, IStoreState, null, ServiceCatalogAction> {
  return async dispatch => {
    try {
      await ServiceCatalog.syncBroker(broker);
    } catch (e) {
      dispatch(errorCatalog(e, "update"));
    }
  };
}

export function getBindings(
  ns?: string,
): ThunkAction<Promise<void>, IStoreState, null, ServiceCatalogAction> {
  return async dispatch => {
    if (ns && ns === definedNamespaces.all) {
      ns = undefined;
    }
    dispatch(requestBindingsWithSecrets());
    try {
      const bindingsWithSecrets = await ServiceBinding.list(ns);
      dispatch(receiveBindingsWithSecrets(bindingsWithSecrets));
    } catch (e) {
      dispatch(errorCatalog(e, "fetch"));
    }
  };
}

export function getBrokers(): ThunkAction<Promise<void>, IStoreState, null, ServiceCatalogAction> {
  return async dispatch => {
    dispatch(requestBrokers());
    try {
      const brokers = await ServiceCatalog.getServiceBrokers();
      dispatch(receiveBrokers(brokers));
    } catch (e) {
      dispatch(errorCatalog(e, "fetch"));
    }
  };
}

export function getClasses(): ThunkAction<Promise<void>, IStoreState, null, ServiceCatalogAction> {
  return async dispatch => {
    dispatch(requestClasses());
    try {
      const classes = await ServiceCatalog.getServiceClasses();
      dispatch(receiveClasses(classes));
    } catch (e) {
      dispatch(errorCatalog(e, "fetch"));
    }
  };
}

export function getInstances(
  ns?: string,
): ThunkAction<Promise<void>, IStoreState, null, ServiceCatalogAction> {
  return async dispatch => {
    if (ns && ns === definedNamespaces.all) {
      ns = undefined;
    }
    dispatch(requestInstances());
    try {
      const instances = await ServiceInstance.list(ns);
      dispatch(receiveInstances(instances));
    } catch (e) {
      dispatch(errorCatalog(e, "fetch"));
    }
  };
}

export function getPlans(): ThunkAction<Promise<void>, IStoreState, null, ServiceCatalogAction> {
  return async dispatch => {
    dispatch(requestPlans());
    try {
      const plans = await ServiceCatalog.getServicePlans();
      dispatch(receivePlans(plans));
    } catch (e) {
      dispatch(errorCatalog(e, "fetch"));
    }
  };
}

export function checkCatalogInstalled(): ThunkAction<
  Promise<boolean>,
  IStoreState,
  null,
  ServiceCatalogAction
> {
  return async dispatch => {
    const isServiceCatalogInstalled = await ServiceCatalog.isCatalogInstalled();
    isServiceCatalogInstalled ? dispatch(installed()) : dispatch(notInstalled());
    return isServiceCatalogInstalled;
  };
}
