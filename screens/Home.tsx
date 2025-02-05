import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Category, Transaction } from "../types";
import { useSQLiteContext } from "expo-sqlite";
import TransactionList from "../components/TransactionsList";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const Home = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db]);

  async function getData() {
    const result = await db.getAllAsync<Transaction>(
      `SELECT * FROM Transactions ORDER BY date DESC`
    );
    setTransactions(result);

    const categoriesResult = await db.getAllAsync<Category>(
      `SELECT * FROM Categories;`
    );
    setCategories(categoriesResult);
  }

  async function deleteTransaction(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Transactions WHERE id = ?;`, [id]);
      await getData();
    });
  }
  return (
    <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: hp(3) }}>
      <TransactionList
        categories={categories}
        transactions={transactions}
        deleteTransaction={deleteTransaction}
      />
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({});
