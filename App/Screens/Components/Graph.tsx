import React from 'react';
import {Text} from 'react-native';
import {chatProps} from '../../../App';
import {BarGraph} from './Graphs/BarGraph';
import {LineGraph} from './Graphs/LineGraph';
import {PieGraph} from './Graphs/PieGraph';

type IState = {
  graphSelected: 'line' | 'bar' | 'pie';
};

export class Graph extends React.Component<chatProps, IState> {
  constructor(props: chatProps) {
    super(props);
    this.state = {graphSelected: 'pie'};
  }

  render() {
    console.log('Rendering graph', this.state.graphSelected);
    const {data, beginDate, endDate} = this.props;
    if (this.state.graphSelected === 'line') {
      return (
        <>
          <Text>LINEEEE</Text>
          <LineGraph
            data={data}
            beginDate={beginDate}
            endDate={endDate}></LineGraph>
        </>
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
