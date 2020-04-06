import { RouterAction } from "connected-react-router";
import { flatten, intersection, uniq } from "lodash";
import * as React from "react";

import {
  ForbiddenError,
  IClusterServiceVersion,
  IPackageManifest,
  IPackageManifestStatus,
} from "../../shared/types";
import { api, app } from "../../shared/url";
import { CardGrid } from "../Card";
import { ErrorSelector, MessageAlert } from "../ErrorAlert";
import InfoCard from "../InfoCard";
import LoadingWrapper from "../LoadingWrapper";
import PageHeader from "../PageHeader";
import SearchFilter from "../SearchFilter";
import OLMNotFound from "./OLMNotFound";

import "./OperatorList.css";

export interface IOperatorListProps {
  isFetching: boolean;
  checkOLMInstalled: () => Promise<boolean>;
  isOLMInstalled: boolean;
  namespace: string;
  getOperators: (namespace: string) => Promise<void>;
  operators: IPackageManifest[];
  error?: Error;
  getCSVs: (namespace: string) => Promise<IClusterServiceVersion[]>;
  csvs: IClusterServiceVersion[];
  filter: string;
  pushSearchFilter: (filter: string) => RouterAction;
}

export interface IOperatorListState {
  filter: string;
  categories: string[];
  filterCategories: { [key: string]: boolean };
}

function getDefaultChannel(packageStatus: IPackageManifestStatus) {
  const defaultChannel = packageStatus.defaultChannel;
  const channel = packageStatus.channels.find(ch => ch.name === defaultChannel);
  return channel!;
}

function getCategories(packageStatus: IPackageManifestStatus) {
  const channel = getDefaultChannel(packageStatus);
  return channel.currentCSVDesc.annotations.categories.split(",").map(c => c.trim());
}

class OperatorList extends React.Component<IOperatorListProps, IOperatorListState> {
  public state: IOperatorListState = {
    filter: "",
    categories: [],
    filterCategories: {},
  };

  public componentDidMount() {
    this.props.checkOLMInstalled();
    this.props.getOperators(this.props.namespace);
    this.props.getCSVs(this.props.namespace);
    this.setState({ filter: this.props.filter });
  }

  public componentDidUpdate(prevProps: IOperatorListProps) {
    if (prevProps.namespace !== this.props.namespace) {
      this.props.getOperators(this.props.namespace);
      this.props.getCSVs(this.props.namespace);
    }
    if (this.props.filter !== prevProps.filter) {
      this.props.getOperators(this.props.namespace);
      this.props.getCSVs(this.props.namespace);
      this.setState({ filter: this.props.filter });
    }

    if (this.props.operators !== prevProps.operators) {
      const categories = uniq(
        flatten(this.props.operators.map(operator => getCategories(operator.status))),
      );
      const filterCategories = {};
      categories.forEach(category => {
        filterCategories[category] = false;
      });
      this.setState({ categories, filterCategories });
    }
  }

  public render() {
    const { isFetching, pushSearchFilter } = this.props;
    return (
      <div>
        <PageHeader>
          <h1>Operators</h1>
          <SearchFilter
            className="margin-l-big"
            placeholder="search operators..."
            onChange={this.handleFilterQueryChange}
            value={this.state.filter}
            onSubmit={pushSearchFilter}
          />
        </PageHeader>
        <main>
          <MessageAlert level="warning">
            <div>
              Operators integration is under heavy development and currently in alpha state. If you
              find an issue please report it{" "}
              <a target="_blank" href="https://github.com/kubeapps/kubeapps/issues">
                here.
              </a>
            </div>
          </MessageAlert>
          <LoadingWrapper loaded={!isFetching}>{this.renderOperators()}</LoadingWrapper>
        </main>
      </div>
    );
  }

  private renderOperators() {
    const { operators, error, csvs, isOLMInstalled } = this.props;
    const { filter, filterCategories } = this.state;
    if (error && error.constructor === ForbiddenError) {
      return (
        <ErrorSelector
          error={error}
          action="list"
          resource="Operators"
          namespace={this.props.namespace}
        />
      );
    }
    if (!isOLMInstalled) {
      return <OLMNotFound />;
    }
    if (error) {
      return (
        <ErrorSelector
          error={error}
          action="list"
          resource="Operators"
          namespace={this.props.namespace}
        />
      );
    }
    const csvNames = csvs.map(csv => csv.metadata.name);
    const installedOperators: IPackageManifest[] = [];
    const availableOperators: IPackageManifest[] = [];
    const filteredOperators = operators.filter(operator => {
      if (filter && !operator.metadata.name.match(filter)) {
        return false;
      }
      const hasFilteredCategories = Object.values(filterCategories).some(
        filteredCategory => filteredCategory,
      );
      if (hasFilteredCategories) {
        const allowedCategories = Object.keys(filterCategories).filter(
          cat => filterCategories[cat],
        );
        const categories = getCategories(operator.status);
        if (intersection(allowedCategories, categories).length === 0) {
          return false;
        }
      }
      return true;
    });
    if (filteredOperators.length === 0) {
      return <p>No Operator found</p>;
    }
    filteredOperators.forEach(operator => {
      if (csvNames.some(csvName => csvName === getDefaultChannel(operator.status).currentCSV)) {
        installedOperators.push(operator);
      } else {
        availableOperators.push(operator);
      }
    });
    return (
      <div className="row margin-t-big">
        <div className="col-2 margin-t-big horizontal-column">
          <div className="margin-b-normal ">
            <b>Categories</b>
          </div>
          {this.state.categories.map(category => {
            return (
              <div key={category}>
                <label
                  className="checkbox"
                  key={category}
                  onChange={this.toggleFilterCategory(category)}
                >
                  <input type="checkbox" />
                  <span>{category}</span>
                </label>
              </div>
            );
          })}
        </div>
        <div className="col-10">
          <div className="padding-l-normal">
            {installedOperators.length > 0 && (
              <>
                <h3>Installed</h3>
                <CardGrid>
                  {installedOperators.map(operator => {
                    return (
                      <InfoCard
                        key={operator.metadata.name}
                        link={app.operators.view(this.props.namespace, operator.metadata.name)}
                        title={operator.metadata.name}
                        icon={api.operators.operatorIcon(
                          this.props.namespace,
                          operator.metadata.name,
                        )}
                        info={`v${operator.status.channels[0].currentCSVDesc.version}`}
                        tag1Content={
                          operator.status.channels[0].currentCSVDesc.annotations.categories
                        }
                        tag2Content={operator.status.provider.name}
                      />
                    );
                  })}
                </CardGrid>
              </>
            )}
            <h3>Available Operators</h3>
            <CardGrid>
              {availableOperators.map(operator => {
                return (
                  <InfoCard
                    key={operator.metadata.name}
                    link={app.operators.view(this.props.namespace, operator.metadata.name)}
                    title={operator.metadata.name}
                    icon={api.operators.operatorIcon(this.props.namespace, operator.metadata.name)}
                    info={`v${operator.status.channels[0].currentCSVDesc.version}`}
                    tag1Content={operator.status.channels[0].currentCSVDesc.annotations.categories}
                    tag2Content={operator.status.provider.name}
                  />
                );
              })}
            </CardGrid>
          </div>
        </div>
      </div>
    );
  }

  private handleFilterQueryChange = (filter: string) => {
    this.setState({
      filter,
    });
  };

  private toggleFilterCategory = (category: string) => {
    return () => {
      const { filterCategories } = this.state;
      this.setState({
        filterCategories: {
          ...filterCategories,
          [category]: !filterCategories[category],
        },
      });
    };
  };
}

export default OperatorList;
