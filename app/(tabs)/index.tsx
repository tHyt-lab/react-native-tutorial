import Button from "@/components/Button";
import CircleButton from "@/components/CircleButton";
import EmojiList from "@/components/EmojiList";
import EmojiPicker from "@/components/EmojiPicker";
import EmojiSticker from "@/components/EmojiSticker";
import IconButton from "@/components/IconButton";
import ImageViewer from "@/components/ImageViewer";
import type { ImageSource } from "expo-image";
import { launchImageLibraryAsync } from "expo-image-picker";
import { saveToLibraryAsync, usePermissions } from "expo-media-library";
import { useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { captureRef } from "react-native-view-shot";
import domtoimage from "dom-to-image";

const PlaceholderImage = require("@/assets/images/background-image.png");

export default function Index() {
	const [permission, requestPermission] = usePermissions();

	const [selectedImage, setSelectedImage] = useState<string>();
	const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [pickedEmoji, setPickedEmoji] = useState<ImageSource>();

	const imageRef = useRef<View>(null);

	if (permission === null) {
		requestPermission();
	}

	const pickImageAsync = async () => {
		const result = await launchImageLibraryAsync({
			mediaTypes: ["images", "videos"],
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			setSelectedImage(result.assets[0].uri);
			setShowAppOptions(true);
		} else {
			alert("You did not select any image.");
		}
	};

	const onReset = () => {
		setShowAppOptions(false);
	};

	const onAddSticker = () => {
		setIsModalVisible(true);
	};

	const onModalClose = () => {
		setIsModalVisible(false);
	};

	const onSaveImageAsync = async () => {
		try {
			if (Platform.OS !== "web") {
				const localUri = await captureRef(imageRef, {
					height: 440,
					quality: 1,
				});

				await saveToLibraryAsync(localUri);
				if (localUri) {
					alert("Image saved to gallery!");
				}
			} else {
				const dataUrl = await domtoimage.toJpeg(imageRef.current, {
					quality: 0.95,
					width: 320,
					height: 440,
				});

				const link = document.createElement("a");
				link.download = "sticker-smash.jpeg";
				link.href = dataUrl;
				link.click();
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<GestureHandlerRootView style={styles.container}>
			<View style={styles.imageContainer}>
				<View ref={imageRef} collapsable={false}>
					<ImageViewer
						imgSource={PlaceholderImage}
						selectedImage={selectedImage}
					/>
					{pickedEmoji && (
						<EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
					)}
				</View>
			</View>
			{showAppOptions ? (
				<View style={styles.optionsContainer}>
					<View style={styles.optionsRow}>
						<IconButton icon="refresh" label="Reset" onPress={onReset} />
						<CircleButton onPress={onAddSticker} />
						<IconButton
							icon="save-alt"
							label="Save"
							onPress={onSaveImageAsync}
						/>
					</View>
				</View>
			) : (
				<View style={styles.footerContainer}>
					<Button
						theme="primary"
						label="Choose a photo"
						onPress={pickImageAsync}
					/>
					<Button
						label="Use this photo"
						onPress={() => setShowAppOptions(true)}
					/>
				</View>
			)}
			<EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
				<EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
			</EmojiPicker>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#25292e",
		alignItems: "center",
	},
	imageContainer: {
		flex: 1,
		paddingTop: 28,
	},
	footerContainer: {
		flex: 1 / 3,
		alignItems: "center",
	},
	optionsContainer: {
		position: "absolute",
		bottom: 80,
	},
	optionsRow: {
		alignItems: "center",
		flexDirection: "row",
	},
});
