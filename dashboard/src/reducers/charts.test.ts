import { getType } from "typesafe-actions";
import actions from "../actions";

import { IChartState } from "../shared/types";
import chartsReducer from "./charts";

describe("chartReducer", () => {
  let initialState: IChartState;

  beforeEach(() => {
    initialState = {
      status: actions.charts.idleStatus,
      page: 1,
      size: 100,
      isFetching: false,
      items: [],
      categories: [],
      selected: {
        versions: [],
      },
      deployed: {},
      nextPage: 1,
      search: { items: [], query: "" },
    };
  });
  const error = new Error("Boom");
  it("unsets an error when changing namespace", () => {
    const state = chartsReducer(undefined, {
      type: getType(actions.charts.errorChart) as any,
      payload: error,
    });
    expect(state).toEqual({
      ...initialState,
      isFetching: false,
      selected: {
        ...initialState.selected,
        error,
      },
    });

    expect(
      chartsReducer(undefined, {
        type: getType(actions.namespace.setNamespaceState) as any,
      }),
    ).toEqual({ ...initialState });
  });
});
