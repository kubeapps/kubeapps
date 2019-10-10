import * as React from "react";
import { IBasicFormParam } from "shared/types";
import Slider from "../../../components/Slider";

export interface ISliderParamProps {
  id: string;
  name: string;
  label: string;
  param: IBasicFormParam;
  unit: string;
  min: number;
  max: number;
  handleBasicFormParamChange: (
    name: string,
    p: IBasicFormParam,
  ) => (e: React.FormEvent<HTMLInputElement>) => void;
}

export interface ISliderParamState {
  value: number;
}

function toNumber(value: string) {
  // Force to return a Number from a string removing any character that is not a digit
  return Number(value.replace(/[^\d\.]/g, ""));
}

class SliderParam extends React.Component<ISliderParamProps, ISliderParamState> {
  public state: ISliderParamState = {
    value: toNumber(this.props.param.value) || this.props.min,
  };

  // onChangeSlider is executed when the slider is dropped at one point
  // at that point we update the parameter
  public onChangeSlider = (values: number[]) => {
    this.handleParamChange(values[0]);
  };

  // onUpdateSlider is executed when dragging the slider
  // we just update the state here for a faster response
  public onUpdateSlider = (values: number[]) => {
    this.setState({ value: values[0] });
  };

  public onChangeInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = toNumber(e.currentTarget.value);
    this.setState({ value });
    this.handleParamChange(value);
  };

  public render() {
    const { param, label, min, max } = this.props;
    return (
      <div>
        <label htmlFor={this.props.id}>
          {label}
          {param.description && (
            <>
              <br />
              <span className="description">{param.description}</span>
            </>
          )}
          <div className="row">
            <div className="col-10">
              <Slider
                // If the parameter defines a minimum or maximum, maintain those
                min={param.minimum || min}
                max={param.maximum || Math.max(max, this.state.value)}
                default={this.state.value}
                onChange={this.onChangeSlider}
                onUpdate={this.onUpdateSlider}
                values={this.state.value}
              />
            </div>
            <div className="col-2">
              <input
                className="disk_size_input"
                id={this.props.id}
                onChange={this.onChangeInput}
                value={this.state.value}
              />
              <span className="margin-l-normal">{this.props.unit}</span>
            </div>
          </div>
        </label>
      </div>
    );
  }

  private handleParamChange = (value: number) => {
    this.props.handleBasicFormParamChange(this.props.name, this.props.param)({
      currentTarget: { value: `${value}${this.props.unit}` },
    } as React.FormEvent<HTMLInputElement>);
  };
}

export default SliderParam;
