import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { NativeModules } from 'react-native';

// You can import from local files
import AssetExample from './components/AssetExample';

import * as SQLite from 'expo-sqlite';
import { Buffer } from 'buffer';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

export default function App() {
  console.log('reandering......');
  async function load() {
    console.warn('load..sss.');
    const db = SQLite.openDatabase('db.db');
    console.log('db:', db);
    async function e(sql, params) {
      console.warn("to sql:", sql, params);
      return new Promise((r, j) => {
        console.warn("fn:", db.transaction);
        db.transaction((tx) => {
          tx.executeSql(
            sql,
            params,
            (_, { rows: { _array } }) => {
              console.warn("resultxxx:", _array);
              r(_array);
            },
            (_, e) => {
              console.warn('err:', e);
              r(true);
            }
          );
        }, e => {
          console.error("e:", e);
          r(true);
        });
      });
    }
    await e(`
    drop table note
    `)
    await e(`
    CREATE TABLE IF NOT EXISTS note (
        id INTEGER PRIMARY KEY ASC,
        content TEXT,
        file BLOB
        );
    `);
    const f = new Buffer("test");
    console.warn("Buffer:", Buffer);
    console.warn("f:", f);
    console.warn("f.prototype:", f.prototype);
    const fBase64 = f.toString("base64");
    console.warn("fBase64:", fBase64);

    await e(`
      INSERT INTO note (content, file)
      values(?, ?)
    `, ["test",
      // f
      // [116,
      //   101,
      //   115,
      //   116,]
      fBase64
    ]);
    const rr = await e(`
    select * from note 
    `)
    rr.forEach(r => {
      r.file = Buffer.from(r.file, "base64");
    });
    console.warn("rr:", rr);
  }
  React.useEffect(() => {
    // console.warn("native moduole: :", NativeModules);
    // console.warn("Object.key: :", Object.keys(NativeModules));

    load();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        Change code in the editor and watch it change on your phone! Save to get
        a shareable url....xxxx2222
      </Text>
      <Card>
        <AssetExample />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
