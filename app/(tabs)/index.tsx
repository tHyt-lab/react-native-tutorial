import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
    return (
        <View
            style={styles.container}
        >
            <Text style={styles.text}>Home screen</Text>
            <Link href="/about" style={styles.button}>
                Go to about
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#25292e'
    },
    text: {
        color: '#fff',
    },
    button: {
        fontSize: 20,
        color: '#fff',
        textDecorationLine: 'underline',
    }
})
