import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import useStreamStore from '../store/streamStore';
import useAuthStore from '../store/authStore';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { activeStreams, isLoading, fetchActiveStreams } = useStreamStore();
  const { logout } = useAuthStore();

  useEffect(() => {
    fetchActiveStreams();
  }, []);

  const renderStreamItem = ({ item }) => (
    <TouchableOpacity
      style={styles.streamCard}
      onPress={() => navigation.navigate('StreamDetails', { streamId: item.id })}
    >
      <Text style={styles.streamTitle}>{item.title}</Text>
      <View style={styles.streamInfo}>
        <Text style={styles.streamStats}>
          👥 {item.active_users_count} watching
        </Text>
        <Text style={styles.streamDuration}>
          ⏱️ {Math.round(item.duration / 60)} mins
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Streams</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateStream')}
        >
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeStreams}
        renderItem={renderStreamItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchActiveStreams} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !isLoading && (
            <Text style={styles.emptyText}>No active streams found</Text>
          )
        }
      />

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#AD52F7',
  },
  createButton: {
    backgroundColor: '#AD52F7',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  streamCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  streamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  streamInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streamStats: {
    color: '#666',
  },
  streamDuration: {
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#AD52F7',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
