import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PieChart from 'react-native-pie-chart';
import RNPickerSelect from 'react-native-picker-select';
import { getCategoryPrices } from '../../services/expenseCategories';

const fetchData = async (monthName) => {
  try {
    const data = await getCategoryPrices(monthName);
    if (Object.keys(data).length === 0)
    {
      return {"There are no expenses available for the current month": 1}
    }
    return data;
  } catch (error) {
    console.error('Failed to fetch category prices:', error);
    throw error;
  }
};

const prepareChartData = (data) => {
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#800000', '#008000', '#000080', '#808000', '#800080', '#008080'];
  const legends = Object.keys(data);
  const series = Object.values(data);
  const sliceColor = colors.slice(0, series.length);

  return { "series": series, "legends": legends, "sliceColor": sliceColor };
};

const MonthlyRecap = () => {
  const [data, setChartData] = useState<{} | null>(null);
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    const fetchDataAndUpdateChart = async () => {
      try {
        const _data = await fetchData(selectedMonth);
        setChartData(_data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataAndUpdateChart(); // Call the async function
  }, [fetchData, selectedMonth]); // Depend on fetchData to re-run effect when it changes
  
  useEffect(() => {
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Create an array of month names in descending order from the current month
    const descendingMonths = [];
    for (let i = currentMonthIndex; i >= 0; i--) {
      descendingMonths.push({ label: monthNames[i], value: monthNames[i] });
    }
    for (let i = 11; i > currentMonthIndex; i--) {
      descendingMonths.push({ label: monthNames[i], value: monthNames[i] });
    }

    setMonths(descendingMonths);
  }, []);

  if (!data || months.length === 0) {
    // Render loading state or placeholder if data is not yet fetched
    return <Text>Loading...</Text>;
  }

  const chartData = prepareChartData(data);
  const series = chartData["series"];
  const legends = chartData["legends"];
  const sliceColor = chartData["sliceColor"];
  const chart_wh = 250;

  return (
    <View style={styles.container}>
      <PieChart
        widthAndHeight={chart_wh}
        series={series as number[]}
        sliceColor={sliceColor}
      />
      <View style={styles.legendContainer}>
        {legends.map((legend, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: sliceColor[index] }]} />
            <Text>{legend}</Text>
          </View>
        ))}
      </View>
      <View>
        <Text style={styles.monthDisplayedText}>{selectedMonth}</Text>
        <RNPickerSelect
          // style={pickerSelectStyles}
          value={selectedMonth} // Default selected value to the current month
          onValueChange={(value) => {
            setSelectedMonth(value);
          }}
          items={months}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  legendContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 8,
    marginRight: 5,
  },
  monthDisplayedText: {
    fontSize: 20,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default MonthlyRecap;
