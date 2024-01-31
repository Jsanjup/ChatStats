import * as shape from 'd3-shape';
import React from 'react';
import {StackedAreaChart} from 'react-native-svg-charts';
import {chatProps, navigableState} from '../../../../App';
import {HitCount} from '../../../Service/Counter';
import AnimatedLoadingModal from '../LoadingModal';

export class LineGraph extends React.Component<chatProps, navigableState> {
  heads: string[];
  dates: string[];
  tableData: Record<string, string | number>[];

  constructor(props: chatProps) {
    super(props);
    this.state = {loading: true};

    this.dates = [];
    this.heads = [];
    this.tableData = [];
  }

  async componentDidMount() {
    console.log('COMPONENT DID MOUNT LINE');
    const data = HitCount.filterDates(
      this.props.data.stats,
      this.props.beginDate,
      this.props.endDate,
    );
    this.dates = HitCount.getDates(data);
    this.heads = ['Date', ...this.props.data.authors];
    const grouped = HitCount.groupByDay(data, this.heads.length - 1);
    for (let st of grouped) {
      let d: Record<string, string | number> = {};
      d.day = st[0].day;
      for (let s of st) {
        d[s.author] = s.total;
      }
      this.tableData.push(d);
    }
    this.setState({
      loading: false,
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <AnimatedLoadingModal
          visible={this.state.loading}
          text="Loading..."></AnimatedLoadingModal>
      );
    }
    const keys = Object.keys(this.tableData[0]);
    keys.shift();
    const colors = [
      '#ff7fff',
      '#7fffff',
      '#ffff7f',
      '#ff7f7f',
      '#7fff7f',
      '#7f7fff',
      '#7f0000',
      '#ff0000',
      '#007f00',
      '#00ff00',
      '#00007f',
      '#0000ff',
    ].slice(0, keys.length);

    console.log('RENDERING', this.tableData);

    return (
      <StackedAreaChart
        style={{
          height: 600,
          width: 400,
          paddingVertical: 16,
          zIndex: 1000,
          flex: 0,
        }}
        data={this.tableData}
        keys={keys}
        colors={colors}
        curve={shape.curveNatural}
        showGrid={false}
      />
    );
  }
}
