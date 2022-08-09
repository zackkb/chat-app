import React from "react";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
      },
      isConnected: null,
    };

    // Set up firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyD_IXpKzIZI3yMGOoEzIUj2Hp-X_Lknaoc",
      authDomain: "chat-7a079.firebaseapp.com",
      projectId: "chat-7a079",
      storageBucket: "chat-7a079.appspot.com",
      messagingSenderId: "856229397556",
      appId: "1:856229397556:web:d67877b2829e72750af661",
      measurementId: "G-5ZDEPE8Z93",
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Reference Firestore collection
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // Go through each document
    querySnapshot.forEach((doc) => {
      // Get the QueryDocumentsSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
      });
    });
    this.setState({
      messages,
    });
  };

  //Offline function to display messages to user offline
  //Gets messages from async storage
  getMessages = async () => {
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (e) {
      console.error(e.message);
    }
  };

  //Saves messages to async storage
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (e) {
      console.error(e.message);
    }
  };

  //Deletes messages from async storage
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (e) {
      console.error(e.messages);
    }
  };

  componentDidMount() {
    this.deleteMessages();
    // Set name as title chat
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    // Check if user is online or offline
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true,
        });
      } else
        this.setState({
          isConnected: false,
        });
    });

    // If online load messages from Firebase, else load messages locally
    if (this.state.isConnected === true) {
      // Reference to load messages from Firebase
      this.referenceChatMessages = firebase.firestore().collection("messages");

      // Authenticate user anonymously
      this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
          firebase.auth().signInAnonymously();
        }
        this.setState({
          uid: user.uid,
          messages: [],
          user: {
            _id: user.uid,
            name: name,
          },
        });
        this.unsubscribe = this.referenceChatMessages
          .orderBy("createdAt", "desc")
          .onSnapshot(this.onCollectionUpdate);
      });
    } else {
      this.getMessages();
    }
  }

  componentWillUnmount() {
    if (this.isConnected === false) {
      this.unsubscribe();
    }
  }

  // Add message to state
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        // Save messages locally with asyncStorage
        this.saveMessages();
        // Call addMessage with last message in message state
        if (this.state.isConnected === true) {
          this.addMessages(this.state.messages[0]);
        }
      }
    );
  }

  // Add message to Firestore
  addMessages = (message) => {
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  };

  // Customize message bubbles
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#fafafa",
          },
          right: {
            backgroundColor: "#2d7ecf",
          },
        }}
      />
    );
  }

  // Don't render input bar if offline
  renderInputToolbar(props) {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  render() {
    let { color, name } = this.props.route.params;
    return (
      <View style={[{ backgroundColor: color }, { flex: 1 }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{ _id: this.state.user._id, name: name }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
