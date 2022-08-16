import React from "react";
// import React Native functionalities
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
// import background from assets
import BackgroundImage from "../assets/bgimg.png";

// Background color selection
const colors = {
  black: "#090C08",
  purple: "#474056",
  grey: "#8A95A5",
  green: "#B9C6AE",
};

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", color: "" };
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={BackgroundImage}
          resizeMode="cover"
          style={styles.bgImage}
        >
          <View style={styles.containerTitle}>
            <Text style={styles.title}>Talk</Text>
          </View>

          <View style={styles.loginContainer}>
            {/* Input box to set user name passed to chat screen */}
            <TextInput
              accessibilityLabel="Text field to input your name"
              accessibilityHint="Name will be used as your chat alias"
              style={styles.input}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder="Your name..."
            />

            <View style={styles.colorBox}>
              {/* Allow user to choose a background color for the chat screen */}
              <Text style={styles.colorBoxText}>Choose Background Color:</Text>
              <View style={styles.colorChoice}>
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="Black circle"
                  accessibilityHint="Select black as background color"
                  accessibilityRole="button"
                  onPress={() => this.setState({ color: colors.black })}
                  style={styles.color1}
                ></TouchableOpacity>

                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="Purple circle"
                  accessibilityHint="Select purple as background color"
                  accessibilityRole="button"
                  onPress={() => this.setState({ color: colors.purple })}
                  style={styles.color2}
                ></TouchableOpacity>

                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="Grey circle"
                  accessibilityHint="Select grey as background color"
                  accessibilityRole="button"
                  onPress={() => this.setState({ color: colors.grey })}
                  style={styles.color3}
                ></TouchableOpacity>

                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="Green circle"
                  accessibilityHint="Select green as background color"
                  accessibilityRole="button"
                  onPress={() => this.setState({ color: colors.green })}
                  style={styles.color4}
                ></TouchableOpacity>
              </View>
            </View>

            {/* Open chatroom, passing user name and background color as props */}
            <Pressable
              accessible={true}
              accessibilityLabel="Button to start chatting"
              accessibilityHint="Start chatting"
              accessibilityRole="button"
              onPress={() =>
                this.props.navigation.navigate("Chat", {
                  name: this.state.name,
                  color: this.state.color,
                })
              }
              style={styles.btnStart}
            >
              <Text style={styles.btnStartText}>Start Chatting</Text>
            </Pressable>
          </View>
        </ImageBackground>
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    justifyContent: "center",
  },
  containerTitle: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  loginContainer: {
    position: "absolute",
    bottom: 30,
    padding: 15,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 4,
    height: "auto",
    width: "88%",
    alignSelf: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: "#757083",
    borderRadius: 4,
    color: "#757083",
    opacity: 0.5,
    fontSize: 16,
    fontWeight: "300",
    padding: 10,
    marginBottom: 20,
  },
  colorBoxText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
  },
  colorChoice: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "88%",
    marginBottom: 20,
  },
  color1: {
    backgroundColor: "#090C08",
    borderRadius: 20,
    height: 40,
    width: 40,
    marginTop: 10,
  },
  color2: {
    backgroundColor: "#474056",
    borderRadius: 20,
    height: 40,
    width: 40,
    marginTop: 10,
  },
  color3: {
    backgroundColor: "#8A95A5",
    borderRadius: 20,
    height: 40,
    width: 40,
    marginTop: 10,
  },
  color4: {
    backgroundColor: "#B9C6AE",
    borderRadius: 20,
    height: 40,
    width: 40,
    marginTop: 10,
  },
  btnStart: {
    height: 50,
    backgroundColor: "#757083",
    justifyContent: "center",
    alignItems: "center",
  },
  btnStartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
