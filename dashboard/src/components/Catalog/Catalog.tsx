import { RouterAction } from "connected-react-router";
import * as React from "react";
import { Link } from "react-router-dom";

import { IChart, IChartState, IClusterServiceVersion, IPackageManifest } from "../../shared/types";
import { api } from "../../shared/url";
import { escapeRegExp } from "../../shared/utils";
import { CardGrid } from "../Card";
import { MessageAlert } from "../ErrorAlert";
import LoadingWrapper from "../LoadingWrapper";
import PageHeader from "../PageHeader";
import SearchFilter from "../SearchFilter";
import CatalogItem, { ICatalogItem } from "./CatalogItem";

interface ICatalogProps {
  charts: IChartState;
  repo: string;
  filter: string;
  fetchCharts: (repo: string) => void;
  pushSearchFilter: (filter: string) => RouterAction;
  namespace: string;
  getCSVs: (namespace: string) => void;
  csvs: IClusterServiceVersion[];
  getOperators: (namespace: string) => void;
  operators: IPackageManifest[];
  featureFlags: { operators: boolean };
}

interface ICatalogState {
  filter: string;
  listCharts: boolean;
  listOperators: boolean;
}

class Catalog extends React.Component<ICatalogProps, ICatalogState> {
  public state: ICatalogState = {
    filter: "",
    listCharts: true,
    listOperators: true,
  };

  public componentDidMount() {
    const {
      repo,
      fetchCharts,
      filter,
      namespace,
      getCSVs,
      getOperators,
      featureFlags,
    } = this.props;
    this.setState({ filter });
    fetchCharts(repo);
    if (featureFlags.operators) {
      getOperators(namespace);
      getCSVs(namespace);
    }
  }

  public componentDidUpdate(prevProps: ICatalogProps) {
    if (this.props.filter !== prevProps.filter) {
      this.setState({ filter: this.props.filter });
    }
    if (this.props.repo !== prevProps.repo) {
      this.props.fetchCharts(this.props.repo);
    }
    if (this.props.namespace !== prevProps.namespace && this.props.featureFlags.operators) {
      this.props.getCSVs(this.props.namespace);
      this.props.getOperators(this.props.namespace);
    }
  }

  public render() {
    const {
      charts: { isFetching, items: allItems },
      pushSearchFilter,
      csvs,
    } = this.props;
    const { listCharts, listOperators } = this.state;
    if (!isFetching && allItems.length === 0) {
      return (
        <MessageAlert
          level={"warning"}
          children={
            <div>
              <h5>Charts not found.</h5>
              Manage your Helm chart repositories in Kubeapps by visiting the{" "}
              <Link to={"/config/repos"}>App repositories configuration</Link> page.
            </div>
          }
        />
      );
    }
    const filteredCharts = this.filteredCharts(allItems);
    const filteredCSVs = this.filteredCSVs(csvs);
    const catalogItems = this.getCatalogItems(filteredCharts, filteredCSVs);
    const items = catalogItems.map(c => (
      <CatalogItem key={`${c.type}/${c.repoName || c.operator}/${c.name}`} item={c} />
    ));
    return (
      <section className="Catalog">
        <PageHeader>
          <h1>Catalog</h1>
          <SearchFilter
            className="margin-l-big"
            placeholder="search charts..."
            onChange={this.handleFilterQueryChange}
            value={this.state.filter}
            onSubmit={pushSearchFilter}
          />
        </PageHeader>
        <LoadingWrapper loaded={!isFetching}>
          <div className="row">
            <div className="col-2">
              {csvs.length > 0 && (
                <>
                  <div className="margin-b-normal">
                    <span>
                      <b>Type:</b>
                    </span>
                  </div>
                  <div>
                    <label className="checkbox" key="listcharts">
                      <input
                        type="checkbox"
                        checked={listCharts}
                        onChange={this.toggleListCharts}
                      />
                      <span>Charts</span>
                    </label>
                  </div>
                  <div>
                    <label className="checkbox" key="listoperators">
                      <input
                        type="checkbox"
                        checked={listOperators}
                        onChange={this.toggleListOperators}
                      />
                      <span>Operators</span>
                    </label>
                  </div>
                </>
              )}
            </div>
            <div className="col-10">
              <CardGrid>{items}</CardGrid>
            </div>
          </div>
        </LoadingWrapper>
      </section>
    );
  }

  private filteredCharts = (charts: IChart[]) => {
    const { filter, listCharts } = this.state;
    if (!listCharts) {
      return [];
    }
    return charts.filter(c => new RegExp(escapeRegExp(filter), "i").test(c.id));
  };

  private filteredCSVs(csvs: IClusterServiceVersion[]) {
    const { filter, listOperators } = this.state;
    if (!listOperators) {
      return [];
    }
    return csvs.filter(c => new RegExp(escapeRegExp(filter), "i").test(c.metadata.name));
  }

  private getCatalogItems(charts: IChart[], csvs: IClusterServiceVersion[]): ICatalogItem[] {
    let result: ICatalogItem[] = [];
    charts.forEach(c => {
      result = result.concat({
        id: c.id,
        name: c.attributes.name,
        icon: c.attributes.icon ? `api/assetsvc/${c.attributes.icon}` : undefined,
        version: c.relationships.latestChartVersion.data.app_version,
        description: c.attributes.description,
        type: "chart",
        repoName: c.attributes.repo.name,
        namespace: this.props.namespace,
      });
    });
    csvs.forEach(csv => {
      const owningOperator = this.props.operators.find(op => {
        const { defaultChannel, channels } = op.status;
        // TODO(andresmgot): It's not mandatory to use the default channel
        const matchingChannel = channels.find(
          channel => channel.name === defaultChannel && channel.currentCSV === csv.metadata.name,
        );
        return !!matchingChannel;
      });
      csv.spec.customresourcedefinitions.owned.forEach(crd => {
        result = result.concat({
          id: crd.name,
          name: crd.displayName,
          icon: owningOperator
            ? api.operators.operatorIcon(this.props.namespace, owningOperator.metadata.name)
            : undefined,
          version: crd.version,
          description: crd.description,
          type: "operator",
          operator: owningOperator?.metadata.name,
          csv: csv.metadata.name,
          namespace: this.props.namespace,
        });
      });
    });
    return result;
  }

  private toggleListCharts = () => {
    this.setState({ listCharts: !this.state.listCharts });
  };

  private toggleListOperators = () => {
    this.setState({ listOperators: !this.state.listOperators });
  };

  private handleFilterQueryChange = (filter: string) => {
    this.setState({
      filter,
    });
  };
}

export default Catalog;
