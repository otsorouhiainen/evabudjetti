import { Modal, View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddItemPopup from '../src/components/AddItemPopup';
import { type Item } from '../src/constants/wizardConfig';
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
} from 'tamagui';
import * as Crypto from 'expo-crypto';
import usePlannedTransactionsStore from '@/src/store/usePlannedTransactionsStore';
import {
  TransactionType,
  TransactionTypeSegment,
} from '../src/components/TransactionTypeSegment';

export default function AddTransaction() {
  const [popupVisible, setPopupVisible] = useState(false);
  const addTransaction = usePlannedTransactionsStore((state) => state.add);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
 	const [showSuccess, setShowSuccess] = useState(false);

  function addItem(newItem: Item) {
    addTransaction({
      ...newItem,
      id: Crypto.randomUUID(),
      type: transactionType,
      category: newItem.category ?? 'uncategorized',
      recurrence: newItem.recurrence ?? 'none',
    });
    setPopupVisible(false);
    setShowSuccess(true);
  }
  return(
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Modal
          visible={popupVisible}
          onRequestClose={() => setPopupVisible(false)}
          transparent={true}
        >
          <AddItemPopup
            onAdd={(item) => addItem(item)}
            onClose={() => setPopupVisible(false)}
          />
        </Modal>
      </View>
      <View style={styles.topContent}>
        <Button
          onPress={() => {
              setTransactionType('income');
              setPopupVisible(true);
          }}
            backgroundColor="$primary200"
            borderRadius={40}
            alignSelf="center"
        >
          Income
        </Button>
        <Button
          onPress={() => {
              setTransactionType('expense');
              setPopupVisible(true);
          }}
            backgroundColor="$primary200"
            borderRadius={40}
            alignSelf="center"
        >
          Expense
        </Button>
        {/* Success alert */}
         <AlertDialog
          open={showSuccess}
          onOpenChange={setShowSuccess}
        >
          <AlertDialog.Portal>
            <AlertDialog.Overlay
              opacity={0.5}
              backgroundColor={'$black'}
            />
            <AlertDialog.Content
              bordered
              elevate
              width={'55%'}
              padding={24}
              borderRadius={16}
            >
            <SizableText size={'$title1'}>
              {'Saved'}
            </SizableText>
            <SizableText size={'$title3'}>
              {`${transactionType} added`}
            </SizableText>
            <XStack
              justifyContent="flex-end"
              marginTop="15"
            >
            <Button
              backgroundColor={'$primary200'}
              style={{ height: '100%' }}
              color={'$white'}
              alignSelf="center"
              onPress={() =>
                setShowSuccess(false)
              }
              fontSize={'$title3'}
            >
            <SizableText
              size={'$title3'}
              color={'$white'}
            >
              OK
            </SizableText>
            </Button>
            </XStack>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
	topContent: {
		height: '20%',
	},
	progressBar: {
		height: '20%',
	},
	container: {
		flexDirection: 'column',
		padding: 20,
		height: '80%',
	},
	dateContainer: {
		flexDirection: 'row',
		height: '20%',
		alignItems: 'center',
		gap: 20,
	},
	content: {
		flexDirection: 'column',
		marginTop: 40,
		height: '60%',
	},
	itemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 5,
		marginTop: 5,
	},
	amountInput: {
		width: '28%',
		height: '100%',
	},
	dateInput: {
		height: '100%',
	},
	footerButton: {
		height: '100%',
		width: '40%',
	},
	buttonContainer: {
		height: '10%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 40,
	},
	itemContent: {
		width: '80%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		gap: 5,
	},
	calendarIcon: {
		width: '5%',
		height: '100%',
	},
	addIcon: {
		marginTop: 10,
		width: '23%',
		height: '100%',
	},
	addIconContainer: {
		alignItems: 'flex-end',
		height: '9%',
	},
	itemName: {
		width: '20%',
	},
	trashIcon: {
		width: '1%',
		height: '100%',
	},
	pageHeader: {
		marginTop: 20,
	},
	stepHeader: {
		marginTop: 20,
	},
});

