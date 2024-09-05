import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";
import moment from "moment";
import Month from "./Month";
import Button from "./Button";
require("moment/min/locales.min");

interface IResponse {
  firstDate: string | moment.Moment;
  secondDate: string | moment.Moment;
}

interface IProps {
  onSelectDateRange: (response: IResponse) => void;
  responseFormat?: string;
  maxDate?: moment.Moment;
  minDate?: moment.Moment;
  blockSingleDateSelection?: boolean;
  font?: string;
  selectedDateContainerStyle?: ViewStyle;
  selectedDateStyle?: TextStyle;
  todayDateStyle?: TextStyle;
  defaultDateStyle?: TextStyle;
  ln?: string;
  onConfirm?: () => void;
  onClear?:() => void;
  clearBtnTitle?: string;
  confirmBtnTitle?: string;
  managedMode?: boolean;
  headersBackgroundColor?: string;
  mergeYearAndMonthPickers?: boolean;

  initialFirstDate?: moment.Moment;
  initialSecondDate?: moment.Moment;
  firstDateManagedValue?: moment.Moment;
  secondDateManagedValue?: moment.Moment;
}

const DateRangePicker = ({
  onSelectDateRange,
  responseFormat,
  maxDate,
  minDate,
  blockSingleDateSelection,
  font,
  selectedDateContainerStyle,
  selectedDateStyle,
  todayDateStyle,
  defaultDateStyle,
  ln = "en",
  onConfirm,
  onClear,
  clearBtnTitle = "Clear",
  confirmBtnTitle = "OK",
  managedMode = false,
  headersBackgroundColor = '#EEEEEE',
  mergeYearAndMonthPickers = false,
  initialFirstDate,
  initialSecondDate,
  firstDateManagedValue,
  secondDateManagedValue,
}: IProps) => {
  const [selectedDate, setSelectedDate] = useState(moment());

  const [firstDate, setFirstDate] = useState<moment.Moment | null>(initialFirstDate || null);
  const [secondDate, setSecondDate] = useState<moment.Moment | null>(initialSecondDate || null);

  const lastMonth = selectedDate.clone().subtract(1, "months");
  const lastYear = selectedDate.clone().subtract(1, "years");
  const nextMonth = selectedDate.clone().add(1, "months");
  const nextYear = selectedDate.clone().add(1, "years");

  moment.locale(ln);

  useEffect(() => {
    setFirstDate(firstDateManagedValue || initialFirstDate || null);
    setSecondDate(secondDateManagedValue || initialSecondDate || null);
  }, [firstDateManagedValue, secondDateManagedValue])

  const returnSelectedRange = (fd: moment.Moment, ld: moment.Moment) => {
    const isWrongSide = ld?.isBefore(fd);

    if (responseFormat) {
      onSelectDateRange({
        firstDate: isWrongSide
          ? ld.format(responseFormat)
          : fd.format(responseFormat),
        secondDate: isWrongSide
          ? fd.format(responseFormat)
          : ld.format(responseFormat),
      });
    } else {
      onSelectDateRange({
        firstDate: isWrongSide ? ld : fd,
        secondDate: isWrongSide ? fd : ld,
      });
    }
  };

  const onSelectDate = (date: moment.Moment) => {
    if (
      blockSingleDateSelection &&
      (firstDate?.isSame(date, "dates") || secondDate?.isSame(date, "dates"))
    ) {
      return;
    }

    if (!firstDate) {
      setFirstDate(date);
    } else {
      if (!secondDate) {
        setSecondDate(date);
        returnSelectedRange(firstDate, date);
      } else {
        setFirstDate(secondDate);
        setSecondDate(date);
        returnSelectedRange(secondDate, date);
      }
    }
  };

  const onPressClear = () => {
    setFirstDate(null);
    setSecondDate(null);
    onSelectDateRange({
      firstDate: "",
      secondDate: "",
    });
    if (onClear) {
      onClear();
    }
  };

  const onPressConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  }

  const isDateSelected = () => firstDate === null || secondDate === null;

  const separateMonthAndYearPickers = (
    <>
      <View style={[styles.titleRow, { backgroundColor: headersBackgroundColor }]}>
        <Button
          font={font}
          disabled={minDate ? lastYear.isBefore(minDate, "months") : false}
          label={`< ${lastYear.format("YYYY")}`}
          onPress={() => setSelectedDate(lastYear)}
        />
        <Text style={{ ...styles.title, fontFamily: font }}>
          {selectedDate.format("YYYY")}
        </Text>
        <Button
          font={font}
          disabled={maxDate ? nextYear.isAfter(maxDate, "months") : false}
          label={`${nextYear.format("YYYY")} >`}
          onPress={() => setSelectedDate(nextYear)}
          align="right"
        />
      </View>

      <View style={[styles.titleRow, { backgroundColor: headersBackgroundColor }]}>
        <Button
          font={font}
          disabled={minDate ? lastMonth.isBefore(minDate, "months") : false}
          label={`< ${lastMonth.locale(ln).format("MMM")}`}
          onPress={() => setSelectedDate(lastMonth)}
        />
        <Text style={{ ...styles.title, fontFamily: font }}>
          {selectedDate.locale(ln).format("MMMM")}
        </Text>
        <Button
          font={font}
          disabled={maxDate ? nextMonth.isAfter(maxDate, "months") : false}
          label={`${nextMonth.locale(ln).format("MMM")} >`}
          onPress={() => setSelectedDate(nextMonth)}
          align="right"
        />
      </View>
    </>
  )

  const combinedMonthAndYearPickers = (
    <View style={[styles.titleRow, { backgroundColor: headersBackgroundColor }]}>
      <Button
        font={font}
        disabled={minDate ? lastMonth.isBefore(minDate, "months") : false}
        label={`< ${lastMonth.locale(ln).format("MMM-YY")}`}
        onPress={() => setSelectedDate(lastMonth)}
      />
      <Text style={{ ...styles.title, fontFamily: font }}>
        {selectedDate.locale(ln).format("MMM YY")}
      </Text>
      <Button
        font={font}
        disabled={maxDate ? nextMonth.isAfter(maxDate, "months") : false}
        label={`${nextMonth.locale(ln).format("MMM-YY")} >`}
        onPress={() => setSelectedDate(nextMonth)}
        align="right"
      />
    </View>
  )

  return (
    <View>
      {!mergeYearAndMonthPickers ? separateMonthAndYearPickers : combinedMonthAndYearPickers}

      <Month
        font={font}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        firstDate={firstDate}
        secondDate={secondDate}
        maxDate={maxDate}
        minDate={minDate}
        selectedDateContainerStyle={selectedDateContainerStyle}
        selectedDateStyle={selectedDateStyle}
        todayDateStyle={todayDateStyle}
        defaultDateStyle={defaultDateStyle}
      />
      {managedMode ? null: (
        <View style={styles.actionButtonsContainer}>
          {confirmBtnTitle ? <View>
            <Pressable
              onPress={onPressConfirm}
              style={[styles.actionBtn]}
            >
              <Text style={{ fontFamily: font }}>{confirmBtnTitle}</Text>
            </Pressable>
          </View> : null}
          {clearBtnTitle ? <View>
            <Pressable
              disabled={isDateSelected()}
              onPress={onPressClear}
              style={[styles.actionBtn, { opacity: isDateSelected() ? 0.3 : 1 }]}
            >
              <Text style={{ fontFamily: font }}>{clearBtnTitle}</Text>
            </Pressable>
          </View> : null}
        </View>
      )}
    </View>
  );
};

export default DateRangePicker;

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
    padding: 5,
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  actionBtn: {
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  }
});
