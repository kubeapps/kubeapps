import { mount, shallow } from "enzyme";
import * as Moniker from "moniker-native";
import * as React from "react";
import AceEditor from "react-ace";

import itBehavesLike from "../../shared/specs";
import { IChartState, IChartVersion, NotFoundError, UnprocessableEntity } from "../../shared/types";
import { ErrorSelector } from "../ErrorAlert";
import ErrorPageHeader from "../ErrorAlert/ErrorAlertHeader";
import LoadingWrapper from "../LoadingWrapper";
import DeploymentForm from "./DeploymentForm";

const defaultProps = {
  kubeappsNamespace: "kubeapps",
  chartID: "foo",
  chartVersion: "1.0.0",
  error: undefined,
  selected: {} as IChartState["selected"],
  deployChart: jest.fn(),
  push: jest.fn(),
  fetchChartVersions: jest.fn(),
  getChartVersion: jest.fn(),
  getChartValues: jest.fn(),
  namespace: "default",
  enableBasicForm: false,
};
const versions = [{ id: "foo", attributes: { version: "1.2.3" } }] as IChartVersion[];
const defaultPropsWithVersion = {
  ...defaultProps,
  selected: {
    versions,
    version: versions[0],
  },
};
let monikerChooseMock: jest.Mock;

itBehavesLike("aLoadingComponent", { component: DeploymentForm, props: defaultProps });

beforeEach(() => {
  monikerChooseMock = jest.fn();
  Moniker.choose = monikerChooseMock;
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("renders an error", () => {
  it("renders an error if it cannot find the given chart", () => {
    const wrapper = mount(
      <DeploymentForm
        {...defaultProps}
        selected={{ error: new NotFoundError() } as IChartState["selected"]}
      />,
    );
    expect(wrapper.find(ErrorPageHeader).exists()).toBe(true);
    expect(wrapper.find(ErrorPageHeader).text()).toContain('Chart "foo" (1.0.0) not found');
  });

  it("renders a generic error", () => {
    const wrapper = shallow(
      <DeploymentForm
        {...defaultProps}
        selected={{ error: new Error() } as IChartState["selected"]}
      />,
    );
    expect(wrapper.find(ErrorSelector).exists()).toBe(true);
    expect(wrapper.find(ErrorSelector).html()).toContain("Sorry! Something went wrong");
  });

  it("renders a custom error if the deployment failed", () => {
    const wrapper = shallow(
      <DeploymentForm
        {...defaultProps}
        selected={
          {
            version: { attributes: {} },
            versions: [{ id: "foo", attributes: {} }],
          } as IChartState["selected"]
        }
        error={new UnprocessableEntity("wrong format!")}
      />,
    );
    wrapper.setState({ latestSubmittedReleaseName: "my-app" });
    expect(wrapper.find(ErrorSelector).exists()).toBe(true);
    expect(wrapper.find(ErrorSelector).html()).toContain(
      "Sorry! Something went wrong processing my-app",
    );
    expect(wrapper.find(ErrorSelector).html()).toContain("wrong format!");
  });

  it("the error does not change if the release name changes", () => {
    const expectedErrorMsg = "Sorry! Something went wrong processing my-app";

    const wrapper = shallow(
      <DeploymentForm
        {...defaultProps}
        selected={
          {
            version: { attributes: {} },
            versions: [{ id: "foo", attributes: {} }],
          } as IChartState["selected"]
        }
        error={new UnprocessableEntity("wrong format!")}
      />,
    );

    wrapper.setState({ latestSubmittedReleaseName: "my-app" });
    expect(wrapper.find(ErrorSelector).exists()).toBe(true);
    expect(wrapper.find(ErrorSelector).html()).toContain(expectedErrorMsg);
    wrapper.setState({ releaseName: "another-app" });
    expect(wrapper.find(ErrorSelector).html()).toContain(expectedErrorMsg);
  });
});

it("renders the full DeploymentForm", () => {
  const wrapper = shallow(
    <DeploymentForm {...defaultProps} selected={{ versions, version: versions[0] }} />,
  );
  expect(wrapper).toMatchSnapshot();
});

it("renders a release name by default, relying in Monickers output", () => {
  monikerChooseMock.mockImplementationOnce(() => "foo").mockImplementationOnce(() => "bar");

  let wrapper = shallow(
    <DeploymentForm {...defaultProps} selected={{ versions, version: versions[0] }} />,
  );
  const name1 = wrapper.state("releaseName") as string;
  expect(name1).toBe("foo");

  // When reloading the name should change
  wrapper = shallow(
    <DeploymentForm {...defaultProps} selected={{ versions, version: versions[0] }} />,
  );
  const name2 = wrapper.state("releaseName") as string;
  expect(name2).toBe("bar");
});

describe("when the basic form is not enabled", () => {
  it("the advanced editor should be shown", () => {
    const wrapper = shallow(
      <DeploymentForm {...defaultPropsWithVersion} enableBasicForm={false} />,
    );
    expect(wrapper.find(LoadingWrapper)).not.toExist();
    expect(wrapper.find(AceEditor)).toExist();
  });

  it("should not show the basic/advanced tabs", () => {
    const wrapper = shallow(
      <DeploymentForm {...defaultPropsWithVersion} enableBasicForm={false} />,
    );
    expect(wrapper.find(LoadingWrapper)).not.toExist();
    expect(wrapper.find(".Tabs")).not.toExist();
  });
});

describe("when the basic form is enabled", () => {
  it("renders the basic form by default", () => {
    const wrapper = shallow(<DeploymentForm {...defaultPropsWithVersion} enableBasicForm={true} />);
    expect(wrapper.state("showBasicForm")).toBe(true);
    expect(wrapper.find(LoadingWrapper)).not.toExist();
    expect(wrapper.find(AceEditor)).not.toExist();
  });

  it("should show the advanced form when clicking", () => {
    const wrapper = shallow(<DeploymentForm {...defaultPropsWithVersion} enableBasicForm={true} />);
    expect(wrapper.state("showBasicForm")).toBe(true);
    expect(wrapper.find(LoadingWrapper)).not.toExist();
    expect(wrapper.find(AceEditor)).not.toExist();

    const advancedTab = wrapper.find("button").filterWhere(t => t.text() === "Advanced");
    expect(advancedTab).toExist();
    advancedTab.simulate("click");
    expect(wrapper.state("showBasicForm")).toBe(false);
    expect(wrapper.find(AceEditor)).toExist();
  });
});
