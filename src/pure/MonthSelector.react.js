/**
 * MonthSelector pure component.
 * @flow
 */

import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  LayoutAnimation,
  TouchableHighlight,
  View,
  Text,
  StyleSheet,
} from "react-native";
import ViewPropTypes from "../util/ViewPropTypes";

// Component specific libraries.
import _ from "lodash";
import Moment from "moment";

type Props = {
  selected?: Moment,
  // Styling
  style?: ViewPropTypes.style,
  // Controls the focus of the calendar.
  focus: Moment,
  onFocus?: (date: Moment) => void,
  // Minimum and maximum valid dates.
  minDate: Moment,
  maxDate: Moment,
  // Styling properties.
  monthView: ViewPropTypes.style,
  monthViewDisabled: ViewPropTypes.style,
  monthText?: Text.propTypes.style,
  monthDisabledText?: Text.propTypes.style,
  selectedText?: Text.propTypes.style,
};
type State = {
  months: Array<Array<Object>>,
};

export default class MonthSelector extends Component {
  props: Props;
  state: State;
  static defaultProps: Props;

  constructor(props: Object) {
    super(props);

    const months = Moment.monthsShort();
    let groups = [];
    let group = [];
    _.map(months, (month, index) => {
      if (index % 3 === 0) {
        group = [];
        groups.push(group);
      }
      // Check if the month is valid.
      let maxChoice = Moment(this.props.focus).month(index).endOf("month");
      let minChoice = Moment(this.props.focus).month(index).startOf("month");
      group.push({
        valid:
          this.props.maxDate.diff(minChoice, "seconds") >= 0 &&
          this.props.minDate.diff(maxChoice, "seconds") <= 0,
        name: month,
        index,
      });
    });
    this.state = {
      months: groups,
    };
  }

  _onFocus = (index: number): void => {
    let focus = Moment(this.props.focus);
    focus.month(index);
    this.props.onFocus && this.props.onFocus(focus);
  };

  render() {
    return (
      <View
        style={[
          {
            // Wrapper view default style.
          },
          this.props.style,
        ]}
      >
        {_.map(this.state.months, (group, i) => (
          <View key={i} style={[styles.group]}>
            {_.map(group, (month, j) => (
              <TouchableHighlight
                key={j}
                style={[styles.monthView, this.props.monthView ? this.props.monthView : null, !month.valid && this.props.monthViewDisabled ? this.props.monthViewDisabled : null]}
                activeOpacity={1}
                underlayColor="transparent"
                onPress={() => month.valid && this._onFocus(month.index)}
              >
                <Text
                  style={[
                    styles.monthText,
                    this.props.monthText,
                    month.valid ? null : styles.disabledText,
                    month.valid ? null : this.props.monthDisabledText,
                    month.index ===
                    (this.props.selected && this.props.selected?.month())
                      ? this.props.selectedText
                      : null,
                  ]}
                >
                  {month.name}
                </Text>
              </TouchableHighlight>
            ))}
          </View>
        ))}
      </View>
    );
  }
}
MonthSelector.defaultProps = {
  focus: Moment(),
  minDate: Moment(),
  maxDate: Moment(),
};

const styles = StyleSheet.create({
  group: {
    //flexGrow: 1,
    flexDirection: "row",
  },
  disabledText: {
    borderColor: "grey",
    color: "grey",
  },
  monthView: {
    flexGrow: 1,
  },
  monthText: {
    borderRadius: 5,
    borderWidth: 1,
    flexGrow: 1,
    margin: 5,
    padding: 10,
    textAlign: "center",
  },
});
