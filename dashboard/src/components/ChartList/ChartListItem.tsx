import * as React from "react";
import { Link } from "react-router-dom";

import placeholder from "../../placeholder.png";
import { IChart } from "../../shared/types";

import Card, { CardContent, CardIcon } from "../Card";

import "./ChartListItem.css";

interface IChartListItemProps {
  chart: IChart;
}

class ChartListItem extends React.Component<IChartListItemProps> {
  public render() {
    const { chart } = this.props;
    const { icon, name, repo } = chart.attributes;
    const iconSrc = icon ? `/api/chartsvc/${icon}` : placeholder;
    const latestAppVersion = chart.relationships.latestChartVersion.data.app_version;
    return (
      <Card key={`${repo}/${name}`} responsive={true} className="ChartListItem">
        <Link to={`/charts/` + chart.id} title={name}>
          <CardIcon icon={iconSrc} />
          <CardContent>
            <div className="ChartListItem__content">
              <div className="ChartListItem__content__title type-big">{name}</div>
              <div className="ChartListItem__content__info">
                <div className="ChartListItem__content__info_version type-small padding-t-tiny type-color-light-blue">
                  {latestAppVersion || "-"}
                </div>
                <div
                  className={`ChartListItem__content__info_repo ${
                    repo.name
                  } type-small padding-t-tiny padding-h-normal`}
                >
                  {repo.name}
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }
}

export default ChartListItem;
