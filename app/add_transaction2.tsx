import { Modal, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AddItemPopup from "../src/components/AddItemPopup";
import { type Item } from "../src/constants/wizardConfig";
import {
  AlertDialog,
  Button,
  Input,
  PortalProvider,
  ScrollView,
  SizableText,
  Stack,
  Text,
  XStack,
  YStack,
} from "tamagui";
import { ChevronDown, ChevronUp, Plus } from "@tamagui/lucide-icons";
import * as Crypto from "expo-crypto";
import usePlannedTransactionsStore from "@/src/store/usePlannedTransactionsStore";
import useRealTransactionsStore from "@/src/store/useRealTransactionsStore";
import { type Category, useCategoryStore } from "@/src/store/categoryStore";
import {
  TransactionType,
  TransactionTypeSegment,
} from "../src/components/TransactionTypeSegment";

export default function AddTransaction() {
  const [popupVisible, setPopupVisible] = useState(false);
  const addTransaction = useRealTransactionsStore((state) => state.add);
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "income",
  );
  const [showSuccess, setShowSuccess] = useState(false);

  // Category state
  const [category, setCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  // Planned transaction state
  const [plannedModalVisible, setPlannedModalVisible] = useState(false);
  const [selectedPlannedTxn, setSelectedPlannedTxn] = useState<Item | null>(
    null,
  );
  const [allocationAmount, setAllocationAmount] = useState("");
  const [upcomingPlannedTransactions, setUpcomingPlannedTransactions] =
    useState<Item[]>([]);
  const [prefillData, setPrefillData] = useState<
    | {
        name?: string;
        amount?: number;
        date?: Date;
        category?: string;
      }
    | undefined
  >(undefined);

  // Stores
  const addCategory = useCategoryStore((state) => state.addCategory);
  const storeCategories = useCategoryStore();
  const plannedTransactions = usePlannedTransactionsStore(
    (state) => state.transactionsForTwoYears,
  );

  // Sync categories from store
  useEffect(() => {
    setCategories(storeCategories.categories);
  }, [storeCategories.categories]);

  // Get upcoming planned transactions
  useEffect(() => {
    const upcomingTxns = (plannedTransactions || []).filter((t) => {
      const txnDate = new Date(t.date);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return txnDate >= now;
    });
    const twentyUpComingTxns = upcomingTxns
      .sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      })
      .slice(0, 20);
    setUpcomingPlannedTransactions(twentyUpComingTxns);
  }, [plannedTransactions]);

  // Dynamic categories filtered by type
  const dynamicCategories = (categories || []).map((c) => ({
    key: c.id,
    label: c.name,
    type:
      c.type === "income" ? TransactionType.Income : TransactionType.Expense,
  }));

  const visibleCategories = expanded
    ? dynamicCategories
    : dynamicCategories.slice(0, 3);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await addCategory({
        id: Crypto.randomUUID(),
        name: newCategory,
        type: transactionType,
        color: "#000000",
        icon: "circle",
      });
      setNewCategory("");
      setCategoryModalVisible(false);
    } catch (e) {
      console.error("Failed to add category:", e);
    }
  };

  const handleSelectPlanned = (txn: Item) => {
    setSelectedPlannedTxn(txn);
    setAllocationAmount(txn.amount.toString());
  };

  const handleAllocationAmountChange = (newValue: string) => {
    const numeric = newValue.replace(/[^0-9.,]/g, "");
    const dotSeparators = numeric.replace(",", ".");
    const parts = dotSeparators.split(".");
    if (parts.length === 1) {
      setAllocationAmount(parts[0]);
    } else {
      const integer = parts[0];
      const decimal = parts.slice(1).join("").slice(0, 2);
      setAllocationAmount(`${integer}.${decimal}`);
    }
  };

  const confirmPlannedAllocation = () => {
    if (selectedPlannedTxn) {
      // Pre-fill the popup with planned transaction data
      setPrefillData({
        name: selectedPlannedTxn.name,
        amount: Number(allocationAmount),
        date: new Date(selectedPlannedTxn.date),
        category: selectedPlannedTxn.category,
      });
      setTransactionType(selectedPlannedTxn.type);
      setCategory(selectedPlannedTxn.category);

      setPlannedModalVisible(false);
      setSelectedPlannedTxn(null);
      setAllocationAmount("");

      // Open the add item popup with pre-filled data
      setPopupVisible(true);
    }
  };

  function addItem(newItem: Item) {
    addTransaction({
      ...newItem,
      id: Crypto.randomUUID(),
      type: transactionType,
      category: newItem.category ?? "uncategorized",
      recurrence: "none",
    });
    setPopupVisible(false);
    setPrefillData(undefined); // Clear prefill data
    setShowSuccess(true);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PortalProvider>
        <Modal
          visible={popupVisible}
          onRequestClose={() => {
            setPopupVisible(false);
            setPrefillData(undefined);
          }}
          transparent={true}
        >
          <AddItemPopup
            onAdd={(item) => addItem(item)}
            onClose={() => {
              setPopupVisible(false);
              setPrefillData(undefined);
            }}
          />
        </Modal>

        {/* Add Category Modal */}
        {categoryModalVisible && (
          <Stack
            position="absolute"
            top={0}
            bottom={0}
            left={0}
            right={0}
            backgroundColor="rgba(0, 0, 0, 0.4)"
            justifyContent="center"
            alignItems="center"
            zIndex={10}
          >
            <YStack
              backgroundColor="$white"
              borderColor={"$black"}
              borderWidth={2}
              opacity={1}
              borderRadius={16}
              padding={24}
              width={"80%"}
              gap={20}
            >
              <SizableText size={"$title1"} marginBottom={8}>
                {"Add category"}
              </SizableText>
              <Input
                value={newCategory}
                onChangeText={setNewCategory}
                placeholder={"Enter category"}
                height={40}
                borderRadius={6}
                marginBottom={22}
                focusStyle={{
                  outlineColor: "transparent",
                }}
                px="10px"
                fontSize={"$title3"}
              />
              <XStack justifyContent="space-between">
                <Button
                  onPress={() => setCategoryModalVisible(false)}
                  borderColor={"$primary200"}
                  padding={22}
                  alignSelf="center"
                  size={42}
                  fontSize={"$title3"}
                >
                  <SizableText size={"$title3"} color={"$primary200"}>
                    {"Cancel"}
                  </SizableText>
                </Button>
                <Button
                  onPress={handleAddCategory}
                  backgroundColor={"$primary200"}
                  size={42}
                  padding={22}
                  alignSelf="center"
                  fontSize={"$title3"}
                >
                  <SizableText size={"$title3"} color={"$white"}>
                    {"Save"}
                  </SizableText>
                </Button>
              </XStack>
            </YStack>
          </Stack>
        )}

        {/* Pick from Planned Modal */}
        {plannedModalVisible && (
          <Stack
            position="absolute"
            top={0}
            bottom={0}
            left={0}
            right={0}
            backgroundColor="rgba(0, 0, 0, 0.4)"
            justifyContent="center"
            alignItems="center"
            zIndex={10}
          >
            <YStack
              backgroundColor="$white"
              borderColor={"$black"}
              borderWidth={2}
              opacity={1}
              borderRadius={16}
              padding={24}
              width={"90%"}
              height={"80%"}
              gap={20}
            >
              <SizableText size={"$title1"} marginBottom={8}>
                {selectedPlannedTxn
                  ? "Allocate Amount"
                  : "Select a planned transaction"}
              </SizableText>

              {!selectedPlannedTxn ? (
                <ScrollView>
                  <YStack gap={10}>
                    {upcomingPlannedTransactions.length === 0 ? (
                      <SizableText>
                        No upcoming planned transactions found.
                      </SizableText>
                    ) : (
                      upcomingPlannedTransactions.map((txn) => (
                        <Button
                          style={{ height: "auto" }}
                          key={`${txn.id}-${txn.date}`}
                          onPress={() => handleSelectPlanned(txn)}
                          padding={5}
                          borderWidth={1}
                          borderColor="$black"
                          backgroundColor="$gray100"
                          pressStyle={{
                            backgroundColor: "$gray200",
                          }}
                          justifyContent="space-between"
                        >
                          <YStack>
                            <SizableText fontWeight="bold">
                              {txn.name}
                            </SizableText>
                            <SizableText size="$body" color="$gray500">
                              {new Date(txn.date).toLocaleDateString()}
                            </SizableText>
                          </YStack>
                          <SizableText>
                            {txn.type === "income" ? "Income" : "Expense"}
                          </SizableText>
                          <SizableText>{txn.amount} €</SizableText>
                        </Button>
                      ))
                    )}
                  </YStack>
                </ScrollView>
              ) : (
                <YStack gap={20}>
                  <SizableText>
                    Allocating for:{" "}
                    <SizableText fontWeight="bold">
                      {selectedPlannedTxn.name}
                    </SizableText>
                  </SizableText>
                  <Input
                    value={allocationAmount}
                    onChangeText={handleAllocationAmountChange}
                    keyboardType="decimal-pad"
                    placeholder="Amount to allocate"
                    height={40}
                    borderRadius={6}
                    px="10px"
                    fontSize={"$title3"}
                  />
                  <XStack justifyContent="space-between" marginTop={20}>
                    <Button
                      style={{ height: "100%" }}
                      onPress={() => setSelectedPlannedTxn(null)}
                      borderColor={"$primary200"}
                    >
                      <SizableText color={"$primary200"}>Back</SizableText>
                    </Button>
                    <Button
                      style={{ height: "100%" }}
                      onPress={confirmPlannedAllocation}
                      backgroundColor={"$primary200"}
                    >
                      <SizableText color={"$white"}>Confirm</SizableText>
                    </Button>
                  </XStack>
                </YStack>
              )}

              {!selectedPlannedTxn && (
                <Button
                  onPress={() => setPlannedModalVisible(false)}
                  borderColor={"$primary200"}
                  style={{ height: "10%" }}
                >
                  <SizableText style={{ height: "50%" }} color={"$primary200"}>
                    Close
                  </SizableText>
                </Button>
              )}
            </YStack>
          </Stack>
        )}

        {/* Main Content */}
        <YStack flex={1} paddingTop={20} paddingHorizontal={20} gap={15}>
          {/* Select Planned Button */}
          <Button
            width={"100%"}
            size="$4"
            backgroundColor="$primary200"
            onPress={() => setPlannedModalVisible(true)}
            alignSelf="center"
          >
            <SizableText color="$white">Select planned</SizableText>
          </Button>

          {/* Category Selection */}
          <YStack gap={10}>
            <XStack justifyContent="space-between" alignItems="center">
              <SizableText size={"$title2"}>{"Category"}</SizableText>
              <Button
                onPress={() => setExpanded(!expanded)}
                icon={expanded ? ChevronUp : ChevronDown}
                background={"$transparent"}
              />
            </XStack>

            {/* Add category button + category chips */}
            <XStack flexWrap="wrap">
              <Button
                onPress={() => setCategoryModalVisible(true)}
                icon={Plus}
                size={26}
                padding={14}
                marginRight={8}
                marginBottom={8}
              />

              {visibleCategories
                .filter((cat) => cat.type.toLowerCase() === transactionType)
                .map(({ key, label }) => {
                  const selected = key === category;
                  return (
                    <Button
                      key={key}
                      onPress={() => setCategory(key)}
                      size={28}
                      padding={14}
                      marginRight={8}
                      marginBottom={8}
                      backgroundColor={selected ? "$primary200" : "$white"}
                    >
                      <SizableText size={"$title3"}>{label}</SizableText>
                    </Button>
                  );
                })}
            </XStack>
          </YStack>

          {/* Income/Expense Buttons */}
          <XStack gap={10} justifyContent="center">
            <Button
              onPress={() => {
                setTransactionType("income");
                setPrefillData(undefined);
                setPopupVisible(true);
              }}
              backgroundColor="$primary200"
              borderRadius={40}
              flex={1}
            >
              Income
            </Button>
            <Button
              onPress={() => {
                setTransactionType("expense");
                setPrefillData(undefined);
                setPopupVisible(true);
              }}
              backgroundColor="$primary200"
              borderRadius={40}
              flex={1}
            >
              Expense
            </Button>
          </XStack>

          {/* Success alert */}
          <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
            <AlertDialog.Portal>
              <AlertDialog.Overlay opacity={0.5} backgroundColor={"$black"} />
              <AlertDialog.Content
                bordered
                elevate
                width={"55%"}
                padding={24}
                borderRadius={16}
              >
                <SizableText size={"$title1"}>{"Saved"}</SizableText>
                <SizableText size={"$title3"}>
                  {`${transactionType} added`}
                </SizableText>
                <XStack justifyContent="flex-end" marginTop="15">
                  <Button
                    backgroundColor={"$primary200"}
                    style={{ height: "100%" }}
                    color={"$white"}
                    alignSelf="center"
                    onPress={() => setShowSuccess(false)}
                    fontSize={"$title3"}
                  >
                    <SizableText size={"$title3"} color={"$white"}>
                      OK
                    </SizableText>
                  </Button>
                </XStack>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog>
        </YStack>
      </PortalProvider>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  topContent: {
    height: "20%",
  },
  progressBar: {
    height: "20%",
  },
  container: {
    flexDirection: "column",
    padding: 20,
    height: "80%",
  },
  dateContainer: {
    flexDirection: "row",
    height: "20%",
    alignItems: "center",
    gap: 20,
  },
  content: {
    flexDirection: "column",
    marginTop: 40,
    height: "60%",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginTop: 5,
  },
  amountInput: {
    width: "28%",
    height: "100%",
  },
  dateInput: {
    height: "100%",
  },
  footerButton: {
    height: "100%",
    width: "40%",
  },
  buttonContainer: {
    height: "10%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  itemContent: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 5,
  },
  calendarIcon: {
    width: "5%",
    height: "100%",
  },
  addIcon: {
    marginTop: 10,
    width: "23%",
    height: "100%",
  },
  addIconContainer: {
    alignItems: "flex-end",
    height: "9%",
  },
  itemName: {
    width: "20%",
  },
  trashIcon: {
    width: "1%",
    height: "100%",
  },
  pageHeader: {
    marginTop: 20,
  },
  stepHeader: {
    marginTop: 20,
  },
});
