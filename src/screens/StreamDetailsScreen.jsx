import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';
import useStreamStore from '../store/streamStore';
import useAuthStore from '../store/authStore';
import { useRoute, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const StreamDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { streamId } = route.params;
  const [comment, setComment] = useState('');
  const videoRef = useRef(null);
  
  const {
    currentStream,
    analytics,
    comments,
    isLoading,
    joinStream,
    endStream,
    fetchStreamAnalytics,
    addComment,
  } = useStreamStore();
  
  const { user } = useAuthStore();

  useEffect(() => {
    handleJoinStream();
    fetchStreamAnalytics(streamId);
    const interval = setInterval(() => {
      fetchStreamAnalytics(streamId);
    }, 5000); // Update analytics every 5 seconds

    return () => clearInterval(interval);
  }, [streamId]);

  const handleJoinStream = async () => {
    const result = await joinStream(streamId);
    if (!result) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to join stream',
      });
      navigation.goBack();
    }
  };

  const handleEndStream = async () => {
    if (currentStream?.user_id === user?.id) {
      await endStream(streamId);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Stream ended successfully',
      });
      navigation.goBack();
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    
    await addComment(streamId, comment);
    setComment('');
  };

  if (isLoading || !currentStream) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={48} color="#AD52F7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{currentStream.title}</Text>
          {currentStream.user_id === user?.id && (
            <TouchableOpacity
              style={styles.endButton}
              onPress={handleEndStream}
            >
              <Text style={styles.endButtonText}>End Stream</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Video Stream */}
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: currentStream.channel_name }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            shouldPlay
            isLooping={false}
            onError={(error) => {
              console.log('Video Error:', error);
              Toast.show({
                type: 'error',
                text1: 'Stream Error',
                text2: 'Failed to load stream',
              });
            }}
          />
        </View>

        {analytics && (
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{analytics.realtime.active_users}</Text>
              <Text style={styles.statLabel}>Watching</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{analytics.realtime.total_joined_users}</Text>
              <Text style={styles.statLabel}>Total Joined</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {Math.round(analytics.historical.avg_session_duration_minutes)}m
              </Text>
              <Text style={styles.statLabel}>Avg. Duration</Text>
            </View>
          </View>
        )}

        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>Comments</Text>
          {comments.map((comment, index) => (
            <View key={index} style={styles.commentItem}>
              <Text style={styles.commentText}>{comment.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.commentInput}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleComment}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#AD52F7',
    flex: 1,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    marginBottom: 15,
  },
  video: {
    flex: 1,
  },
  endButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  endButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#AD52F7',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  commentsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  commentItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  commentText: {
    color: '#333',
  },
  commentInput: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#AD52F7',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default StreamDetailsScreen;
