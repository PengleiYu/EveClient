import {Button, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, View} from "react-native";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const key_ore_storage = "key_ore_storage"
const key_mining_speed = "key_mining_speed"
const key_cnt_mining_tools_per_ship = "key_cnt_mining_tools_per_ship"
const key_cnt_ship = "key_cnt_ship"
const key_ore_volume = "key_ore_volume"

function toast(msg: string) {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
}

const MiningPage = () => {
    const [text_ore_storage, set_text_ore_storage] = useState('3000')
    const [text_mining_speed, set_text_mining_speed] = useState('15')
    const [text_cnt_mining_tools_per_ship, set_text_cnt_mining_tools_per_ship] = useState('2')
    const [text_cnt_ship, set_text_cnt_ship] = useState('1')

    const [text_ore_volume, set_text_ore_volume] = useState('22000')

    const [time_storage_filled, set_time_storage_filled] = useState(0)
    const [cnt_fill_storage, set_cnt_fill_storage] = useState(0)
    const [time_empty_ore, set_time_empty_ore] = useState(0)

    async function save_configs() {
        await AsyncStorage.multiSet(
            [
                [key_ore_storage, text_ore_storage],
                [key_mining_speed, text_mining_speed],
                [key_cnt_mining_tools_per_ship, text_cnt_mining_tools_per_ship],
                [key_cnt_ship, text_cnt_ship],
                [key_ore_volume, text_ore_volume],
            ]
            , errors => {
                if (errors) toast(JSON.stringify(errors))
            })
        toast("保存成功")
    }

    const func_table = new Map([
        [key_ore_storage, set_text_ore_storage],
        [key_mining_speed, set_text_mining_speed,],
        [key_cnt_mining_tools_per_ship, set_text_cnt_mining_tools_per_ship],
        [key_cnt_ship, set_text_cnt_ship],
        [key_ore_volume, set_text_ore_volume],
    ])

    async function load_config() {
        await AsyncStorage.multiGet([], (errors, result) => {
            if (errors) {
                toast(JSON.stringify(errors))
            }
            toast(JSON.stringify(result?.keys()))
            if (!result) return
            for (let i = 0; i < result.length; i++) {
                let [key, value] = result[i]
                if (!value) continue
                let func = func_table.get(key)
                if (func) func(value)
            }
        })
        toast("数据读取成功")
    }


    function toast_config() {
        const msg = `storage=${text_ore_storage},speed=${text_mining_speed},cnt=${text_cnt_mining_tools_per_ship},volume=${text_ore_volume}`
        ToastAndroid.show(msg, ToastAndroid.SHORT)
    }

    function cacluate() {
        const ore_storage = Number(text_ore_storage)
        const mining_speed = Number(text_mining_speed)
        const cnt_mining_tools_per_ship = Number(text_cnt_mining_tools_per_ship)
        const cnt_ship = Number(text_cnt_ship)
        const ore_volume = Number(text_ore_volume)

        const time_storage_filled = ore_storage / (mining_speed * cnt_mining_tools_per_ship)
        const cnt_fill_storage = ore_volume / (ore_storage * cnt_ship)
        const time_empty_ore = ore_volume / (mining_speed * cnt_mining_tools_per_ship * cnt_ship)
        set_time_storage_filled(time_storage_filled)
        set_cnt_fill_storage(cnt_fill_storage)
        set_time_empty_ore(time_empty_ore)
    }

    const place_holder = "请输入";
    useEffect(() => {
        load_config().then()
    }, [])

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text>矿船参数</Text>
                <View style={styles.lab_item}>
                    <Text>矿仓大小</Text>
                    <TextInput
                        placeholder={place_holder}
                        defaultValue={text_ore_storage}
                        onChangeText={set_text_ore_storage}/>
                </View>
                <View style={styles.lab_item}>
                    <Text>矿枪挖矿速度</Text>
                    <TextInput
                        placeholder={place_holder}
                        defaultValue={text_mining_speed}
                        onChangeText={set_text_mining_speed}></TextInput>
                </View>
                <View style={styles.lab_item}>
                    <Text>矿枪数量</Text>
                    <TextInput
                        placeholder={place_holder}
                        defaultValue={text_cnt_mining_tools_per_ship}
                        onChangeText={set_text_cnt_mining_tools_per_ship}></TextInput>
                </View>
                <View style={styles.lab_item}>
                    <Text>矿船数量</Text>
                    <TextInput
                        placeholder={place_holder}
                        defaultValue={text_cnt_ship}
                        onChangeText={set_text_cnt_ship}></TextInput>
                </View>
                <Text>矿石参数</Text>
                <View style={styles.lab_item}>
                    <Text>总体积</Text>
                    <TextInput
                        placeholder={place_holder}
                        defaultValue={text_ore_volume}
                        onChangeText={set_text_ore_volume}></TextInput>
                </View>


                <View style={styles.lab_item}>
                    <Text>满仓耗时</Text>
                    <Text>{time_storage_filled}</Text>
                </View>
                <View style={styles.lab_item}>
                    <Text>满仓次数</Text>
                    <Text>{cnt_fill_storage}</Text>
                </View>
                <View style={styles.lab_item}>
                    <Text>清空矿石总耗时</Text>
                    <Text>{time_empty_ore}</Text>
                </View>

                <Button title={"计算"} onPress={cacluate}/>
                <View style={styles.lab_item}>
                    <Button title={"保存参数"} onPress={save_configs}/>
                    <Button title="一键设置闹钟" onPress={() => toast_config()}/>
                </View>
            </View>

        </ScrollView>
    )

}

const styles = StyleSheet.create({
    lab_item: {
        flexDirection: 'row',
    },
    container: {
        alignItems: 'flex-start',
        alignContent: 'flex-start',
    }
})

export default MiningPage
