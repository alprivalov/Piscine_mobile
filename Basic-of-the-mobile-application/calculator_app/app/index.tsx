import { Text, View, StyleSheet } from "react-native";
import Button from "./components/Button";
import { useState} from "react";
import { evaluate } from "mathjs";



export default function Index() {

    const [value, setValue] = useState<string>("");
    const [result, setResult] = useState<number>(0);

    const handlePress = (str :string) => {
        console.log(str === "AC");
        try{
            if(str === "AC")
                setValue("");
            else if(str === "x")
                setValue(value + '*');
            else if (str === "C")
                setValue((value) => value.slice(0, -1));
            else if (str === "=") {
                if(value != "")
                    setResult(evaluate(value));
            }
            else
                setValue(value + str);
        } catch (error) {
            setResult("Error");
        }
    }

  return (
      <View style={styles.screen}>
          <View style={styles.appBar}>
              <Text style={styles.appBarTitle}>Calculator</Text>
          </View>

          <View
              style={[
                  styles.main,
              ]}
          >
              <View style={styles.display}>
                  <Text style={styles.expression}>{value}</Text>
                  <Text style={styles.result}>{result.toString()}</Text>
              </View>


          <View style={styles.keyboard}>
              <View style={styles.row}>

                  <Button label={"7"} type={"number"} onPress={handlePress}></Button>
                  <Button label={"8"} type={"number"} onPress={handlePress}></Button>
                  <Button label={"9"} type={"number"} onPress={handlePress}></Button>
                  <Button label={"C"} type={"action"} onPress={handlePress}></Button>
                  <Button label={"AC"} type={"action"} onPress={handlePress}></Button>
              </View>
              <View style={styles.row}>

                  <Button label={"4"} type={"number"} onPress={handlePress}></Button>
                  <Button label={"5"} type={"number"} onPress={handlePress}></Button>
                  <Button label={"6"} type={"number"} onPress={handlePress}></Button>
                  <Button label={"+"} type={"operator"} onPress={handlePress}></Button>
                  <Button label={"-"} type={"operator"} onPress={handlePress}></Button>
                  </View>

              <View style={styles.row}>
                  <Button label={"1"} type={"number"} onPress={handlePress}></Button>
                  <Button label={"2"} type={"number"} onPress={handlePress}></Button>
                  <Button label={"3"} type={"number"} onPress={handlePress}></Button>

                  <Button label={"x"} type={"operator"} onPress={handlePress}></Button>
                  <Button label={"/"} type={"operator"} onPress={handlePress}></Button>

              </View>
              <View style={styles.row}>
                  <Button label={"0"} type={"number"}  onPress={handlePress}></Button>
                  <Button label={"."} type={"number"}  onPress={handlePress}></Button>
                  <Button label={"00"} type={"number"}  onPress={handlePress}></Button>
                  <Button label={"="} type={"operator"} onPress={handlePress}></Button>
                  <Button label={""} type={"none"} onPress={()=>{}}></Button>
              </View>
          </View>
      </View>
  </View>
  );
}
const styles = StyleSheet.create({

    main: {
        flex: 1,
        flexDirection: "column",
    },

    screen: {
        flex: 1,
        backgroundColor: "#2f3f46",
    },

    appBar: {
        height: 56,
        backgroundColor: "#5f7c87",
        justifyContent: "center",
        alignItems: "center",
    },

    appBarTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },

    display: {
        flex: 2,
        backgroundColor: "#37474f",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        padding: 16,
    },

    expression: {
        color: "#5e7b89",
        fontSize: 33,
    },

    result: {
        color: "#5e7b89",
        fontSize: 33,
    },

    keyboard: {
        flex: 3,
        backgroundColor: "#607d8b",
    },

    row: {
        flex: 1,
        flexDirection: "row",
    },
});
