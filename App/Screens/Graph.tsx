import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {StackParamList} from '../../App';
import {BarGraph} from './Components/BarGraph';
import {LineGraph} from './Components/LineGraph';
import {PieGraph} from './Components/PieGraph';

type Props = NativeStackScreenProps<StackParamList, 'ChatGraph'>;
type IState = {
  graphSelected: 'line' | 'bar' | 'pie';
};

export class Graph extends React.Component<Props, IState> {
  constructor(props: Props) {
    super(props);
    this.state = {graphSelected: 'pie'};
  }

  render() {
    const {data, beginDate, endDate} = this.props.route.params;
    if (this.state.graphSelected === 'line') {
      return (
        <LineGraph
          data={data}
          beginDate={beginDate}
          endDate={endDate}></LineGraph>
      );
    }
    if (this.state.graphSelected === 'bar') {
      return (
        <BarGraph
          data={data}
          beginDate={beginDate}
          endDate={endDate}></BarGraph>
      );
    }
    return (
      <PieGraph data={data} beginDate={beginDate} endDate={endDate}></PieGraph>
    );
  }
}
