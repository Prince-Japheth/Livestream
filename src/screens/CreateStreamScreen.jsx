import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import useStreamStore from '../store/streamStore';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const CreateStreamScreen = () => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const navigation = useNavigation();
  const { createStream, isLoading, error } = useStreamStore();

  const handleCreate = async () => {
    if (!title || !duration) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    const durationInSeconds = parseInt(duration) * 60; // Convert minutes to seconds
    const result = await createStream(title, durationInSeconds);
    
    if (result && !error) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Stream created successfully',
      });
      navigation.navigate('StreamDetails', { streamId: result.stream.id });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error || 'Failed to create stream',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Stream</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Stream Title"
        value={title}
        onChangeText={setTitle}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Duration (in minutes)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreate}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size={24} color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Stream</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#AD52F7',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#AD52F7',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateStreamScreen;
