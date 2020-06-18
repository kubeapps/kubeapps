import * as React from "react";
import { Link } from "react-router-dom";

import { IChartVersion } from "../../shared/types";
import * as url from "../../shared/url";

interface IChartVersionsListProps {
  selected: IChartVersion;
  versions: IChartVersion[];
  targetNamespace: string;
}

interface IChartVersionsListState {
  showAll: boolean;
}

class ChartVersionsList extends React.Component<IChartVersionsListProps, IChartVersionsListState> {
  public state: IChartVersionsListState = {
    showAll: false,
  };

  public render() {
    const versions = this.state.showAll ? this.props.versions : this.props.versions.slice(0, 5);
    const items = versions.map(v => {
      const chartData = v.relationships.chart.data;
      const selectedClass =
        this.props.selected.attributes.version === v.attributes.version
          ? "type-bold type-color-action"
          : "";
      // TODO(absoludity): the namespace in the url call below should be the current namespace, not the repo namespace.
      // For example, if a global chart is being viewed from `my-namespace`, we don't want to switch to the `kubeapps`
      // namespace when selecting a specific chart version (as the app currently does).
      return (
        <li key={v.id}>
          <Link className={selectedClass} to={url.app.charts.version(chartData.name, v.attributes.version, chartData.repo, this.props.targetNamespace)}>
            {v.attributes.version} - {this.formatDate(v.attributes.created)}
          </Link>
        </li>
      );
    });
    return (
      <div className="ChartVersionsList">
        <ul className="remove-style padding-l-reset margin-b-reset">{items}</ul>
        {!this.state.showAll && this.props.versions.length > 5 && (
          <a className="type-small" onClick={this.handleShowAll}>
            Show all...
          </a>
        )}
      </div>
    );
  }

  public formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  public handleShowAll = () => {
    this.setState({
      showAll: true,
    });
  };
}

export default ChartVersionsList;
