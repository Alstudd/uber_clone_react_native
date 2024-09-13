import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { GoogleInputProps } from "@/types/type";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { icons } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useEffect, useRef, useState } from "react";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
const olaMapsApiKey = process.env.EXPO_PUBLIC_OLAMAPS_API_KEY;

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (data.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [data]);

  const handleTextChange = async (text: string) => {
    setText(text);
    const response = await fetchAPI(
      `https://api.olamaps.io/places/v1/autocomplete?input=${text}&api_key=${olaMapsApiKey}`
    );
    setData(response.predictions);
  };

  return (
    <View className="relative">
      <View
        className={`flex flex-row items-center px-2 py-3 relative z-50 rounded-xl ${containerStyle}`}
      >
        <View className="justify-center items-center w-6 h-6">
          <Image
            source={icon ? icon : icons.search}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            marginHorizontal: 20,
            position: "relative",
            shadowColor: "#d4d4d4",
            width: 250,
          }}
        >
          <TextInput
            style={{
              backgroundColor: textInputBackgroundColor
                ? textInputBackgroundColor
                : "white",
              fontSize: 16,
              fontWeight: "600",
              width: "100%",
              height: 20,
              borderRadius: 200,
            }}
            placeholder={initialLocation ?? "Where do you want to go?"}
            onChangeText={(text) => handleTextChange(text)}
            value={text}
            numberOfLines={1}
          />
        </View>
        {text.length > 0 && (
          <TouchableOpacity
            className="justify-center items-center w-6 h-6"
            onPress={() => {
              setText("");
              setData([]);
            }}
          >
            <Image
              source={icons.close}
              className="w-4 h-4"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        {/* <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder="Where do you want to go?"
        debounce={200}
        styles={{
          textInputContainer: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            marginHorizontal: 20,
            position: "relative",
            shadowColor: "#d4d4d4",
          },
          textInput: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            fontSize: 16,
            fontWeight: "600",
            marginTop: 5,
            width: "100%",
            borderRadius: 200,
          },
          listView: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            position: "relative",
            top: 0,
            width: "100%",
            borderRadius: 10,
            shadowColor: "#d4d4d4",
            zIndex: 99,
          },
        }}
        onPress={(data, details = null) => {
          handlePress({
            latitude: details?.geometry.location.lat!,
            longitude: details?.geometry.location.lng!,
            address: data.description,
          });
        }}
        query={{
          key: googlePlacesApiKey,
          language: "en",
        }}
        renderLeftButton={() => (
          <View className="justify-center items-center w-6 h-6">
            <Image
              source={icon ? icon : icons.search}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </View>
        )}
        textInputProps={{
          placeholderTextColor: "gray",
          placeholder: initialLocation ?? "Where do you want to go?",
        }}
      /> */}
      </View>
      {showDropdown && (
        <View
          style={{
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            position: "absolute",
            top: "100%",
            width: "100%",
            shadowColor: "#d4d4d4",
            zIndex: 99,
            marginTop: 7,
          }}
        >
          {data.map((item: any, index) => {
            return (
              <TouchableOpacity
                key={index}
                className="bg-white shadow-sm shadow-neutral-300 py-3 px-3 border-b-[1px] border-b-gray-200"
                onPress={() => {
                  setText(item.description); //item.structured_formatting.main_text
                  handlePress({
                    latitude: item.geometry.location.lat,
                    longitude: item.geometry.location.lng,
                    address: item.description,
                  });
                  setData([]);
                }}
              >
                <Text numberOfLines={1}>{item?.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default GoogleTextInput;
