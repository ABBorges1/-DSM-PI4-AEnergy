import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Text,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const Main = () => {
  const [selectedOption, setSelectedOption] = useState('hourly');
  const [selectedGraph, setSelectedGraph] = useState('money');
  const [chartData, setChartData] = useState(null);
  const [chartVisible, setChartVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleGraphChange = (graph) => {
    setSelectedGraph(graph);
  };

  const handleSubmit = async () => {
    console.log('Selected Date:', date);
    console.log('Selected Option:', selectedOption);
    console.log('Selected Graph:', selectedGraph);

    const dateYMD = date.toISOString().slice(0, 10);

    console.log('Selected Date', dateYMD);
    const token = await AsyncStorage.getItem('token');
    console.log(token);

    let headersList = {
      Accept: '*/*',
      Authentication: `${token}`,
      Authorization: `Bearer ${token}`,
    };

    const response = await api.get(
      `/products/1/consumptions?type=${selectedOption}&date=${dateYMD}`,
      { headers: headersList }
    );
    console.log(response.data);

    setChartVisible(true);

    const chartData =
      selectedGraph === 'money'
        ? response.data.consumptionsInMoney.data
        : response.data.consumptionsInKw.data;
    setChartData(chartData.slice(0, 18));

  };

  const options = [
    {
      label: 'Por hora',
      value: 'hourly',
    },
    {
      label: 'Por dia',
      value: 'daily',
    },
  ];

  const graphs = [
    {
      label: 'Dinheiro',
      value: 'money',
    },
    {
      label: 'kWh',
      value: 'kWh',
    },
  ];

  const formattedDate = date ? date.toDateString() : 'Selecione a data';

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.calendar}>
          <Button title={formattedDate} onPress={() => setOpen(true)} />
          <DatePicker
            modal
            open={open}
            date={date}
            mode="date"
            onConfirm={(date) => {
              setOpen(false);
              setDate(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>
        <View style={[styles.optionsContainer, styles.horizontalOptionsContainer]}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                selectedOption === option.value && styles.selectedOptionButton,
                index < options.length - 1 && { marginRight: 60 },
              ]}
              onPress={() => handleOptionChange(option.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedOption === option.value && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.graphContainer, styles.horizontalGraphContainer]}>
          {graphs.map((graph, index) => (
            <TouchableOpacity
              key={graph.value}
              style={[
                styles.graphButton,
                selectedGraph === graph.value && styles.selectedGraphButton,
                index < graphs.length - 1 && { marginRight: 80 },
              ]}
              onPress={() => handleGraphChange(graph.value)}
            >
              <Text
                style={[
                  styles.graphText,
                  selectedGraph === graph.value && styles.selectedGraphText,
                ]}
              >
                {graph.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Buscar" onPress={handleSubmit} />
      </View>

      <View style={styles.chartContainer}>
        {chartData && (
          <LineChart
            data={{
              labels: chartData.map((_, index) => String(index + 1)),
              datasets: [
                {
                  data: chartData,
                  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
            width={380}
            height={200}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
  },
  topContainer: {
    width: '80%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  optionsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  horizontalOptionsContainer: {
    flexDirection: 'row',
  },
  optionButton: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  selectedOptionButton: {
    backgroundColor: 'blue',
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    color: 'white',
  },
  graphContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  horizontalGraphContainer: {
    flexDirection: 'row',
  },
  graphButton: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  selectedGraphButton: {
    backgroundColor: 'blue',
  },
  graphText: {
    fontSize: 16,
  },
  selectedGraphText: {
    color: 'white',
  },
  buttonContainer: {
    width: '80%',
    marginTop: 8,
    marginBottom: 16,
  },
  chartContainer: {
    marginTop: 16,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  calendar: {
    width: '100%',
    marginTop: 8,
    marginBottom: 16,
  },
});

export default Main;