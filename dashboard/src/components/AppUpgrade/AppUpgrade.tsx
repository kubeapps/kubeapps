import * as React from "react";

import { RouterAction } from "react-router-redux";
import { hapi } from "../../shared/hapi/release";
import { IServiceBindingWithSecret } from "../../shared/ServiceBinding";
import { IAppRepository, IChartState, IChartVersion, IRBACRole } from "../../shared/types";
import ErrorSelector from "../ErrorAlert/ErrorSelector";
import LoadingWrapper from "../LoadingWrapper";
import UpgradeForm from "../UpgradeForm";
import SelectRepoForm from "../UpgradeForm/SelectRepoForm";

interface IAppUpgradeProps {
  app: hapi.release.Release;
  bindingsWithSecrets: IServiceBindingWithSecret[];
  error: Error | undefined;
  repoError: Error | undefined;
  kubeappsNamespace: string;
  namespace: string;
  releaseName: string;
  version: string;
  repos: IAppRepository[];
  repo: IAppRepository;
  selected: IChartState["selected"];
  upgradeApp: (
    version: IChartVersion,
    releaseName: string,
    namespace: string,
    values?: string,
  ) => Promise<boolean>;
  clearRepo: () => any;
  checkChart: (repo: string, chartName: string) => any;
  fetchChartVersions: (id: string) => Promise<{}>;
  getApp: (releaseName: string, namespace: string) => Promise<void>;
  getBindings: () => Promise<IServiceBindingWithSecret[]>;
  getChartVersion: (id: string, chartVersion: string) => Promise<{}>;
  getChartValues: (id: string, chartVersion: string) => Promise<any>;
  push: (location: string) => RouterAction;
  fetchRepositories: () => Promise<void>;
}

interface IAppUpgradeState {
  selectRepoForm: JSX.Element;
}

class AppUpgrade extends React.Component<IAppUpgradeProps, IAppUpgradeState> {
  public componentDidMount() {
    const { releaseName, getApp, namespace, fetchRepositories } = this.props;
    getApp(releaseName, namespace);
    fetchRepositories();
  }

  public render() {
    const { app, repos, error, namespace, releaseName } = this.props;
    if (
      !repos ||
      !app ||
      !app.chart ||
      !app.chart.metadata ||
      !app.chart.metadata.name ||
      !app.chart.metadata.version
    ) {
      if (!error) {
        return <LoadingWrapper />;
      } else {
        return (
          <ErrorSelector
            error={error}
            namespace={namespace}
            action="update"
            defaultRequiredRBACRoles={{ update: this.requiredRBACRoles() }}
            resource={releaseName}
          />
        );
      }
    }
    if (!this.props.repo.metadata) {
      return (
        <div>
          <SelectRepoForm
            {...this.props}
            error={this.props.repoError}
            chartName={app.chart.metadata.name}
          />
        </div>
      );
    }
    return (
      <div>
        <UpgradeForm
          {...this.props}
          appCurrentVersion={app.chart.metadata.version}
          appCurrentValues={(app.config && app.config.raw) || ""}
          chartName={app.chart.metadata.name}
          repo={this.props.repo.metadata.name}
        />
      </div>
    );
  }

  private requiredRBACRoles(): IRBACRole[] {
    return [
      {
        apiGroup: "kubeapps.com",
        namespace: this.props.kubeappsNamespace,
        resource: "apprepositories",
        verbs: ["get"],
      },
    ];
  }
}

export default AppUpgrade;
