// @flow strict
import * as React from 'react';
import { PluginStore } from 'graylog-web-plugin/plugin';

import AggregationWidgetConfig from 'enterprise/logic/aggregationbuilder/AggregationWidgetConfig';
import VisualizationConfig from 'enterprise/logic/aggregationbuilder/visualizations/VisualizationConfig';
import type { FieldTypeMappingsList } from 'enterprise/stores/FieldTypesStore';
import type { Rows } from 'enterprise/logic/searchtypes/pivot/PivotHandler';

import FullSizeContainer from './FullSizeContainer';

const defaultVisualizationType = 'table';

type OnVisualizationConfigChange = (VisualizationConfig) => void;

type Props = {
  config: AggregationWidgetConfig,
  data: {
    total: number,
    rows: Rows,
  },
  editing?: boolean,
  fields: FieldTypeMappingsList,
  onVisualizationConfigChange: OnVisualizationConfigChange,
};

export type VisualizationComponentProps = {|
  config: AggregationWidgetConfig,
  data: Rows,
  editing?: boolean,
  fields: FieldTypeMappingsList,
  height: number,
  onChange: OnVisualizationConfigChange,
  width: number,
|};

// eslint-disable-next-line no-undef
export type VisualizationComponent =
  { type?: string, propTypes?: any }
  & React.ComponentType<VisualizationComponentProps>;

const _visualizationForType = (type: string): VisualizationComponent => {
  const visualizationTypes = PluginStore.exports('visualizationTypes');
  const visualization = visualizationTypes.filter(viz => viz.type === type)[0];
  if (!visualization) {
    throw new Error(`Unable to find visualization component for type: ${type}`);
  }
  return visualization.component;
};

const AggregationBuilder = ({ config, data, editing = false, fields, onVisualizationConfigChange = () => {} }: Props) => {
  const VisComponent = _visualizationForType(config.visualization || defaultVisualizationType);
  const { rows } = data;
  return (
    <FullSizeContainer>
      {({ height, width }) => (
        <VisComponent config={config}
                      data={rows}
                      editing={editing}
                      fields={fields}
                      height={height}
                      width={width}
                      onChange={onVisualizationConfigChange} />
      )}
    </FullSizeContainer>
  );
};

AggregationBuilder.defaultProps = {
  editing: false,
};

export default AggregationBuilder;
