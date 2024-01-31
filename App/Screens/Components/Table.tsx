import moment from 'moment';
import React, {Component} from 'react';
import {ScrollView, View} from 'react-native';
import {Row, Table} from 'react-native-table-component';
import {chatProps, navigableState} from '../../../App';
import {Stat} from '../../Model/Types';
import {HitCount} from '../../Service/Counter';
import {styles} from '../Styles/TableStyles';

import {stats} from '../../Model/Stat';
import AnimatedLoadingModal from './LoadingModal';

export default class TableComponent extends Component<
  chatProps,
  navigableState
> {
  heads: string[];
  dates: string[];
  tableData: (number | string)[][];
  widthArr: number[];

  constructor(props: chatProps) {
    super(props);
    this.state = {loading: true};

    this.dates = [];
    this.heads = [];
    this.tableData = [];
    this.widthArr = [80];
  }

  async componentDidUpdate(prevProps: chatProps) {
    if (
      prevProps.beginDate !== this.props.beginDate ||
      prevProps.data !== this.props.data ||
      prevProps.endDate !== this.props.endDate
    ) {
      console.log('COMPONENT DID UPDATE!');
      this.setState({loading: true});
      const navData: stats = this.props.data;
      const beginDate: moment.Moment | undefined = this.props.beginDate;
      const endDate: moment.Moment | undefined = this.props.endDate;
      console.log('Filter between dates', beginDate, endDate);
      const data = HitCount.filterDates(navData.stats, beginDate, endDate);
      this.dates = HitCount.getDates(data);
      console.log('Filtered...', this.dates);
      this.heads = ['Date', ...navData.authors];
      this.widthArr = [...this.widthArr, ...navData.authors.map(a => 60)];
      this.tableData = HitCount.groupByDay(data, this.heads.length - 1).map(
        (st: Stat[]) => st.map((s: Stat) => s.total),
      );
      this.setState({loading: false});
    }
  }

  render() {
    if (this.state.loading) {
      console.log('LOADINGGG!!!');
      return (
        <AnimatedLoadingModal
          visible={this.state.loading}
          text="Loading..."></AnimatedLoadingModal>
      );
    }
    console.log(
      '[Table]',
      'Data',
      this.tableData,
      'Heads',
      this.heads,
      this.heads.length,
      this.tableData[0].length,
      'Dates',
      this.dates,
      this.dates.length,
      this.tableData.length,
    );
    return (
      <View style={styles.container}>
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              <Row
                data={this.heads}
                style={styles.header}
                textStyle={styles.text}
                widthArr={this.widthArr}
              />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                {this.tableData.map((rowData, index) => {
                  rowData.unshift(this.dates[index]);
                  return (
                    <Row
                      key={index}
                      data={rowData}
                      style={
                        index % 2 === 0
                          ? {
                              ...styles.row,
                              backgroundColor: '#F7F6E7',
                            }
                          : styles.row
                      }
                      textStyle={styles.text}
                      widthArr={this.widthArr}
                    />
                  );
                })}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}
