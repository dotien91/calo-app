import { StoreSlice } from "@zustand";

interface IMyBankAcc {
  cardNumber: string;
  cardName: string;
  bank: any;
  id: string;
}

export interface PaymentSlice {
  myBankAccounts: IMyBankAcc[];
}

const createPaymentSlice: StoreSlice<PaymentSlice> = (set, get) => ({
  myBankAccounts: [],
  updateMyBankAccounts: (item, method: string) => {
    const { myBankAccounts } = get();
    let newData = [...myBankAccounts];
    if (method == "delete") {
      newData = myBankAccounts.filter((_item) => _item.id != item.id);
    } else if (method == "add") {
      newData = [item, ...myBankAccounts];
    } else {
      const findIndex = myBankAccounts.findIndex(
        (_item) => _item.id == item.id,
      );
      console.log("findIndexfindIndex", { findIndex, item, myBankAccounts });
      newData = newData.map((item) => ({ ...item, isDefault: false }));
      if (findIndex != -1) {
        newData[findIndex] = { ...item, isDefault: true };
      }
      // newData = [{...item, isDefault: true}, ...myBankAccounts.filter((_item) => _item.id != item.id)];
    }

    console.log("updateMyBankAccounts store", method, newData);
    set(() => ({
      myBankAccounts: newData,
    }));
  },
});

export default createPaymentSlice;
