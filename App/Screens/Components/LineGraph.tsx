import * as shape from 'd3-shape';
import React from 'react';
import {Text} from 'react-native';
import {StackedAreaChart} from 'react-native-svg-charts';
import {chatProps, navigableState} from '../../../App';
import {HitCount} from '../../Service/Counter';

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
      return <Text>LOADING...</Text>;
    }
    const keys = Object.keys(this.tableData[0]);
    keys.shift();
    const colors = [
      '#6600aa',
      '#7700bb',
      '#8800cc',
      '#9911dd',
      '#aa22ff',
      '#bb44ff',
      '#cc66ff',
      '#dd88ff',
      '#eeaaff',
      '#ffeeff',
    ].slice(0, keys.length);

    return (
      <StackedAreaChart
        style={{height: 200, paddingVertical: 16}}
        data={this.tableData}
        keys={keys}
        colors={colors}
        curve={shape.curveNatural}
        showGrid={false}
      />
    );
  }
}
