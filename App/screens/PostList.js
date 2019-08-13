import React from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  View
} from "react-native";
import { api } from "../util/api";

const styles = StyleSheet.create({
  row: {
    paddingVertical: 8,
    paddingHorizontal: 10
  }
});

export const PostRow = ({ item, index, onPress }) => (
  <TouchableOpacity
    testID={`post-row-${index}`}
    style={styles.row}
    onPress={onPress}
  >
    <Text>{item.title}</Text>
  </TouchableOpacity>
);

class PostList extends React.Component {
  state = {
    posts: [],
    loading: true,
    error: null
  };

  componentDidMount() {
    this.getPosts();
  }

  getPosts = () => {
    api("/posts")
      .then(posts => {
        this.setState({ posts, loading: false, error: null });
      })
      .catch(error => {
        this.setState({ loading: false, error: error.message });
      });
  };

  render() {
    return (
      <SafeAreaView>
        <FlatList
          testID="post-list"
          data={this.state.posts}
          renderItem={rowProps => (
            <PostRow
              {...rowProps}
              onPress={() => navigation.navigate("Post", { postId: item.id })}
            />
          )}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={() => {
            if (this.state.loading) {
              return <Text testID="loading-message">Loading</Text>;
            }

            if (this.state.error) {
              return <Text testID="error-message">{this.state.error}</Text>;
            }

            return <Text testID="no-results">Sorry, no results found.</Text>;
          }}
        />
      </SafeAreaView>
    );
  }
}

export default PostList;
